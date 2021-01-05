(function () {
  var testFunc = undefined;
  var testIns = undefined;
  var testData = undefined;
  var testObj = undefined;
  var testHide = undefined;
  var loginResp = {};
  var popResp = {}; // 弹窗数据
  var GT_VALIDATE = {
    TYPE_PHONE_OCCUPIED: 1, //  手机号是否存在极验校验
    TYPE_PHONE_SMS_SUBMIT: 2 // 手机短信验证码校验
  };
  $('.send_smscode').css('backgroundColor', '#B9DBF3');//浅蓝色
      // 获取租户是否需要认证协议的接口
      function getUserAgreementConfig (previousResp) {
        $.ajax({
          url: '/Portal/Account/GetPrivacyPolicyTag?t='+(new Date()).getTime(),
          type: 'GET',
          success: function (res) {
            var data = res.Data;
            popResp = data;
            // 之前没有弹过隐私协议 再次弹出
            if(data.PrivacyPolicyEnable && data.AgreementList && !data.AgreementList[0].IsPopuped) {
              loadGrayTanentScript();
            }
            else {
              window.location.href = previousResp.RedirectUrl;
            }
          }
        });
      }
      function loadGrayTanentScript() {
        var scriptElement = $('<script>');
        scriptElement.attr('src','/Scripts/account/grayTanent.js');
        scriptElement.attr('type', 'text/javascript');
        $('head').append(scriptElement);
        var confirmCallback = function() {
          var _postData = popResp.AgreementList && popResp.AgreementList[0].Key;
          // _postData 后端要求传数组
          $.ajax({
            url: '/Portal/Account/SetPrivacyPolicyTag?t='+ (new Date()).getTime(),
            method: 'post',
            data: {
              keys: new Array(_postData)
            },
            success: function(){
              window.location = loginResp.RedirectUrl;
            }
          })
        }
        generateGrayTenantFn.createModal({
          content: '自2020年6月起，首次登录平台前请您确认已阅读并同意我们最新的 <a href="/Portal/Apply/PrivacyPolicy1" target="_blank">隐私政策</a>，以确保您的个人权利和隐私信息安全。',
          buttons: [{
            buttonCls: 'agreement-button',
            callback: confirmCallback,
            buttonTxt: '我已阅读并同意'
          }]
        })
      }
  $(function () {
    $.ajax({
      url: '/User/Account/InitGeetest?t='+(new Date()).getTime(),
      type: 'GET',
      success: function (res) {
        var data = JSON.parse(res);
        testData = data;
        var test = new BSRecruitGeeTest(data.gt, data.challenge, !data.success);
        test.init().then(function (captchaObj) {
          captchaObj.bindForm('#loginForm');
          testIns = captchaObj;
        });
        testFunc = test;
        test.on('success', function (res) {
          switch (currentValidateMode) {
            case GT_VALIDATE.TYPE_PHONE_OCCUPIED: {
              $('#loginForm').submit();
              //                             $(".dl_foucs_val").blur();
            }
              break;
            case GT_VALIDATE.TYPE_PHONE_SMS_SUBMIT: {
              var phoneNum = parseInt($('#phoneNum').val());
              $.ajax({
                url: '/User/Account/CheckPhoneAndSendSMSVerification',
                type: 'POST',
                data: {
                  mobile: phoneNum,
                  businessType: 0,
                  fnGeetestChallenge: res.geetest_challenge,
                  fnGeetestValidate: res.geetest_validate,
                  fnGeetestSeccode: res.geetest_seccode
                },
                error: function () {
                  throw new Error('getEncryptionKey is error');
                },
                success: function (resp) {
                  if (resp.Data) {
                    //对海康威视做租户限制
                    if (window.hikvision) {
                      $('.hasphone').hide();

                    } else {
                      $('.hasphone').show();

                    }
                    allowSend = false;
                  }
                  if (!resp.Data && resp.Message === 'OneMinuteLimit') {
                    $('.time_limit').text(window.i18n['time_limit']);
                    $('.time_limit').show();
                  }
                  if (resp.Message === 'unregisterd') {
                    $('.hasphone').show(); //显示未注册
                    $('.send_smscode').css('backgroundColor', '#B9DBF3');//浅蓝色
                    allowSend = false;
                    clear = true;
                  }
                  if (resp.Message === 'error_limit') {
                    $('.error_limit').text(i18n['error_limit']);
                    $('.error_limit').show();
                  }
                  if (resp.Code === 720) {
                    $('.error_limit').text('请求超时，请手动刷新页面后重试');
                    $('.error_limit').show();
                  }
                  if (resp.Message === '') {
                    $('.hasphone').hide();  //隐藏未注册
                    allowSend = false;
                    countDown();
                  }
                },
                complete: function () {
                  !!testIns && testIns.reset();
                }
              });
            }
              break;
          }
        });
      },
      error: function () {
      }
    });
    document.title = window.i18n.login;
    var form = $('#loginForm').ajaxForm({
      dataType: 'json',
      beforeSerialize: function ($form, options) {
        var jsonResultHidden = form.find('input:hidden[name=JsonResult]').val(true);
        if (!jsonResultHidden.length) {
          jsonResultHidden = $('<input type="hidden" name="JsonResult" value="true"/>').appendTo(form);
        }
      },
      beforeSubmit: function (formData, jqForm, options) {
        // 替换极验Name
        for (var i = 0; i < formData.length; i++) {
          if (formData[i].name === 'geetest_challenge') {
            formData[i].name = 'fnGeetestChallenge';
          }
          if (formData[i].name === 'geetest_validate') {
            formData[i].name = 'fnGeetestValidate';
          }
          if (formData[i].name === 'geetest_seccode') {
            formData[i].name = 'fnGeetestSeccode';
          }
        }
        var dataPass = _.findWhere(formData, {
          'name': 'Password'
        });
        if (dataPass) {
          //获取加密安全码
          $.ajax({
            url: '/User/Account/GetEncryptionKey',
            type: 'GET',
            async: false,
            error: function () {
              throw new Error('getEncryptionKey is error');
            },
            success: function (resp) {
              var key = resp.ValidataCode,
                iv = resp.IPAddess;
              key = CryptoJS.enc.Utf8.parse(key);
              iv = CryptoJS.enc.Utf8.parse(iv);
              // DES 加密
              var encrypted = CryptoJS.DES.encrypt(dataPass.value, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
              });
              dataPass.value = encrypted.toString();
            }
          });
        }
      },
      success: function (response, textStatus) {
        if (response.Success) {
          loginResp = response;
          if (response.RedirectUrl) {
            if (response.RedirectUrl.indexOf('MobileBindTemplate') !== -1) {
              sessionStorage.setItem('BindMobileReturnUrl', response.NewBusinessUrl);
              window.location.href = response.RedirectUrl;
            }
            else {
              // 非优衣库定制租户 不弹窗
              getUserAgreementConfig(loginResp);
            }
          } else {
            window.location.href = 'test.zhiye.com/home';
          }
        } else if (response.Code === 720) {
          // $('.error_limit').text("请求超时，请手动刷新页面后重试");
          // $('.error_limit').show();
          $('.pass_err').text('请求超时，请手动刷新页面后重试');//极验二次校验错误
          $('.pass_err').css('color', '#cc2929');
          $('.pass_err').show();
        } else {
          var eleName = response.FieldErrors[0].FieldName;
          var errorMsg = response.FieldErrors[0].ErrorMessage;
          var validator = form.validate();
          testHide = validator;
          //var errors = [];
          for (var i = 0; i < response.FieldErrors.length; i++) {
            var obj = {};
            var i18n_err_msg = response.FieldErrors[i].ErrorMessage;
            if (i18n_err_msg === 'account_freeze_tip') { //为海康威视单租户处理提示信息
              obj[response.FieldErrors[i].FieldName] = '今日密码错误次数过多，该账号已被锁定，请24小时后重试';
            } else {
              obj[response.FieldErrors[i].FieldName] = window.i18n[i18n_err_msg];
            }
            testObj = obj;
            //obj[response.FieldErrors[i].FieldName] = window.i18n[i18n_err_msg];
            validator.showErrors(obj);
            // testHide.showErrors(testObj);
          }
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('error');
      }
    });
  });

  var allowSend = false;
  var that = this;
  var clear = true;
  this.sec = 60;
  $('.i18n_valid').click(function () {
    $('.pass_err').hide();
    $('.freeze_tip').hide();
  });
  $('.tab_mobile').click(function () {
    $('.mid_line').css('top', '130px');
    $('.tab_email').removeClass('selected_color');
    $('.tab_mobile').addClass('selected_color');
    $('#loginForm').hide();
    $('#loginFormPhone').show();
  });
  $('.tab_email').click(function () {
    $('.mid_line').css('top', '165px');
    $('.tab_mobile').removeClass('selected_color');
    $('.tab_email').addClass('selected_color');
    $('#loginForm').show();
    $('#loginFormPhone').hide();
  });
  $('#phoneNum').bind('input propertychange', function () {
    $('.error_limit').hide();
    $('.error_code').hide();
    $('.send_limit').hide();
    $('.hasphone').hide();
    $('.inter-phone').hide();
    $('.phone-error').hide();
    $('.time_limit').hide();
  });
  $('#messgeCode').bind('input propertychange', function () {
    $('.error_limit').hide();
    $('.error_code').hide();
    $('.send_limit').hide();
    $('.time_limit').hide();
  });
  $('#phoneNum').bind('input propertychange', function (event) {
    // if(clear === false) return;
    //         clear = false;
    if ($('#phoneNum').val() === '') {
      $('.phone-error').text(window.i18n.require); //必填
      $('.phone-error').show();
      return;
    }
    var phoneNum = parseInt($('#phoneNum').val());
    var validInterPhone = new RegExp(window.foreignMobileRegex).test($('#phoneNum').val());
    if (validInterPhone) {
      $('.phone-error').text(window.i18n['only_innerPhone']); //短信验证码登录仅支持国内手机号
      $('.inter-phone').show();
      return;
    }
    var validPhone = window.mobileRegexStr.test(phoneNum);
    // if(clear === false) return;
    if (validPhone) {
      if (clear === false) return;
      $('.send_smscode').css('backgroundColor', '#1687D9');
      allowSend = true;
    } else {
      //发送验证码接口显示浅蓝色
      allowSend = false;
      $('.send_smscode').css('backgroundColor', '#B9DBF3');
      //             $('.send_smscode').text(i18n.send_SMS_code); //发送验证码
      $('.phone-error').text(window.i18n['phone_type_error']); //手机号格式不正确
      $('.phone-error').show();
      //             clear = true;
    }
  });
  //     var clear = false;
  $('.pre_phone_code').click(function () {
    document.getElementById('pre_phone_code').src = '//' + window.location.hostname + '/User/Account/GetValidateCode?=' + new Date().getTime();
  });
  $('.send_smscode').click(function () {
    $('.time_limit').hide();
    if (!allowSend) return;
    clear = false;
    if ($('#phoneNum').val() === '') {
      $('.phone-error').text(window.i18n.require);
      $('.phone-error').show();
      return;
    }
    var phoneNum = parseInt($('#phoneNum').val());
    var validInterPhone = new RegExp(window.foreignMobileRegex).test($('#phoneNum').val());
    if (validInterPhone) {
      $('.phone-error').text(window.i18n['only_innerPhone']);
      $('.inter-phone').show();
      return;
    }
    var validPhone = window.mobileRegexStr.test(phoneNum);
    if (validPhone) {
      if (testData) {
        currentValidateMode = GT_VALIDATE.TYPE_PHONE_SMS_SUBMIT;
        testIns.verify();
      }
    } else {
      //发送验证码接口显示浅蓝色
      $('.send_smscode').css('backgroundColor', '#B9DBF3');//浅蓝色
      $('.send_smscode').text(i18n.send_SMS_code);
      $('.phone-error').text(window.i18n['phone_type_error']);
      $('.phone-error').show();
      clear = true;
    }
  });

  function countDown() {
    allowSend = false;
    $('.send_smscode').css('background', '#B9DBF3');
    var secTimer = setInterval(function () {
      if (clear) {
        clearInterval(secTimer);
        this.sec = 60;
        return;
      }
      that.sec--;
      if (that.sec === 59) {
        $('.send_smscode').html(window.i18n.sended);
      } else {
        $('.send_smscode').html(that.sec + 's');
      }
      if (that.sec == 0) {
        $('.send_smscode').text(i18n.reSend);
        $('.send_smscode').css('background', '#1687D9');
        that.sec = 60;
        clearInterval(secTimer);
        allowSend = true;
        clear = true;
      }
    }, 1000);
  };
  $(function () {
    $('.dl_textinp').blur(function () {
      var node = $(this);
      var nodeVal = node.val();
      var nodeDefault = node.attr('defaultValue');
      if (nodeVal == '') {
        // node.val(nodeDefault);
        node.addClass('dl_dftgrey');
      }
    });
    $('.dl_textinp').focus(function () {
      var node = $(this);
      var nodeVal = node.val();
      var nodeDefault = node.attr('defaultValue');
      if (nodeVal == nodeDefault) {
        node.val('');
        node.removeClass('dl_dftgrey');
      }
    });
  });
  $('.sina,.qq').click(function () {
    var url = $(this).attr('url');
    window.open(url, 'newwindow', 'height=600, width=800, top=200, left=300, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no');
  });

  $('.forgetPwd,.register').click(function () {
    var url = $(this).attr('url');
    window.location.href = url;
    return false;
  });

  $('#btnLogin').click(function () {
    var content = $('#loginForm');
    if (content.valid()) {
      if (testData) {
        currentValidateMode = GT_VALIDATE.TYPE_PHONE_OCCUPIED;
        testIns.verify();
      }
    }
    //          $('#loginForm').submit();
    // $(".dl_foucs_val").blur();
  });
  $('#btnLoginPhone').click(function () {
    if ($('.hasphone').attr('style') === '') {
      return;
    }
    if ($('#phoneNum').val() === '') {
      $('.phone-error').text(window.i18n.require);
      $('.phone-error').show();
    }
    if (!$('#loginFormPhone').valid()) return false;
    var mobile = $('#phoneNum').val();
    var smsCode = $('#messgeCode').val();
    $.ajax({
      url: '/User/Account/VerificationCodeLogin'
      , type: 'POST'
      , data: { phoneNum: mobile, smsCode: smsCode, RememberMe: true }
      , async: false
      , error: function () {
        throw new Error('getEncryptionKey is error');
      }
      , success: function (response, textStatus) {
        if (response.Success) {
          if (response.RedirectUrl) {
           getUserAgreementConfig(response);
          }
        } else if (response.Code === 720) {
          $('.error_limit').text('请求超时，请手动刷新页面后重试');
          $('.error_limit').show();
          // $(".pass_err").text('请求超时，请手动刷新页面后重试');//极验二次校验错误
          // $(".pass_err").show();
        } else {
          if (response.FieldErrors[0].ErrorMessage == 'SMS_code_error') {
            $('.error_code').text(i18n.SMS_code_error);//短信验证码输入错误，请重新输入
            $('.error_code').show();
          }
          if (response.FieldErrors[0].ErrorMessage == 'error_limit') {
            $('.error_code').text(i18n.error_limit); //今日校验码错误次数过多，该手机号已锁定，请明日再试
            $('.error_code').show();
          }
          // $(".error_code").show();
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('error');
      }
    });
  });
  if ($('#IsCheck').is(':checked')) {
    $('#RememberMe').attr('value', 'true');
  } else {
    $('#RememberMe').attr('value', 'false');
  }
  $('.change_validate').click(function () {
    getImgSrc();
  });

  function getImgSrc() {
    if (document.getElementById('imgcode')) {
      document.getElementById('imgcode').src = '//' + window.location.hostname + '/User/Account/GetValidateCode?=' + new Date().getTime();
    }
  }

  getImgSrc();
  window.closeFn = function () {
    $.dialog.close();
  };
}());
