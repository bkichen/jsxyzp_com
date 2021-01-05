(function () {
  var gtTest = undefined;
  var gtTestIns = undefined;
  var GT_VALIDATE = {
    TYPE_DOMESTIC_PHONE_OCCUPIED: 1, //  国内手机号是否存在校验
    TYPE_FOREIGN_PHONE_OCCUPIED: 2 //  国外手机号注册校验
  };
  var allowSend = false;
  // 是否处于1分钟发送之中;
  var isSending = false;
  var currentValidateMode = 0;

  // 极验初始化
  function gtInit() {
      $.get('/User/Account/InitGeetest?t=' + (new Date()).getTime(), function (data) {
      if (!!data) {
        var response = JSON.parse(data);
        gtTest = new BSRecruitGeeTest(response.gt, response.challenge, !response.success);
        gtTest.init()
          .then(function (captchaObj) {
            gtTestIns = captchaObj;
          });
        gtTest.on('success', function (res) {
          switch (currentValidateMode) {
            case GT_VALIDATE.TYPE_DOMESTIC_PHONE_OCCUPIED: {
              // $('#getPwdForm').submit();
              handleSendSMSCode(res);
            }
              break;
            case GT_VALIDATE.TYPE_FOREIGN_PHONE_OCCUPIED: {
              handleForeignPhoneOccupied(res);
            }
              break;
          }
        });
        gtTest.on('error', function (error) {
          switch (currentValidateMode) {
            case GT_VALIDATE.TYPE_MAIL_SUBMIT: {
            }
              break;
            case GT_VALIDATE.TYPE_DOMESTIC_PHONE_SMS_REGISTER: {
            }
              break;
            case GT_VALIDATE.TYPE_PHONE_OCCUPIED: {
            }
              break;
          }
        });
      }
    });
  }

  function handleForeignPhoneOccupied(res) {
    var phoneNum = $('#interPhoneNum').val();
    $.ajax({
      url: '/User/Account/CheckPhoneOccupied',
      type: 'GET',
      data: {
        mobile: phoneNum,
        businessType: 1,
        fnGeetestChallenge: res.geetest_challenge,
        fnGeetestValidate: res.geetest_validate,
        fnGeetestSeccode: res.geetest_seccode
      },
      error: function () {
        throw new Error('getEncryptionKey is error');
      },
      success: function (resp) {
        if (resp.Code === 720) {
          $('.geetest_error').show();
          return;
        }
        if (!resp.Data) {
          $('#registInterForm .hasphone').show();
        } else {
          $('#registInterForm').submit();
          $('#registInterForm .hasphone').hide();
        }
      },
      complete: function () {
        !!gtTestIns && gtTestIns.reset();
      }
    });
  }

  function handleSendSMSCode(res) {
    if (!allowSend) return;
    //注册时手机号查重接口
    var phoneNum = $('#phoneNum').val();
    $.ajax({
      url: '/User/Account/CheckPhoneAndSendSMSVerification',
      type: 'POST',
      data: {
        mobile: phoneNum,
        businessType: 1,
        fnGeetestChallenge: res.geetest_challenge,
        fnGeetestValidate: res.geetest_validate,
        fnGeetestSeccode: res.geetest_seccode
      },
      error: function () {
        throw new Error('getEncryptionKey is error');
      },
      success: function (resp) {
        if (resp.Code === 720) {
          $('.geetest_error').show();
          return;
        }
        if (resp.Data) {
          if ($('.tab_email').attr('class').indexOf('selected_color') !== -1) {
            $('#registInterForm .hasphone').hide();
          }
          //普通手机号有关的操作
          if ($('.tab_mobile').attr('class').indexOf('selected_color') !== -1) {
            $('#registPhoneForm .hasphone').hide();
          }
          countDown();
        } else {
          //   // $('.hasphone').show();
          //   //普通手机号注册有关的操作
          if ($('.tab_mobile').attr('class').indexOf('selected_color') !== -1) {
            if (window.hikvision) {
              $('#registPhoneForm .hasphone').hide();
            } else {
              $('#registPhoneForm .hasphone').show();
            }
          }
        }
      },
      complete: function () {
        !!gtTestIns && gtTestIns.reset();
      }
    });
  }

  function countDown() {
    var sec = 60;
    allowSend = false;
    isSending = true;
    $('.send_smscode').css('background', '#B9DBF3');
    var secTimer = setInterval(function () {
      sec--;
      if (sec === 59) {
        $('.send_smscode').html(window.i18n.sended);
      } else {
        $('.send_smscode').html(sec + 's');
      }

      if (sec === 0) {
        sec = 60;
        clearInterval(secTimer);
        allowSend = true;
        isSending = false;
        $('.send_smscode').text(i18n.reSend);
        $('.send_smscode').css('background', '#1687D9');
      }
    }, 1000);
  }

  gtInit();

  (function () {
    if ($('.service_content').length != 0) {
      $('.mid_line').css('top', '200px');
    } else {
      $('.mid_line').css('top', '190px');
    }

    function OpenTips() {
      var html = ['<div class="dl_dialog1">',
        '     <div class="dl_dialog_wrap">',
        '       <div class="dl_tocenter">',
        '<span class="dl_dialog_icook dl_ft14_grey2"><b>' + window.i18n.reg_success + '</b>',//注册成功
        '</span>',
        '</div>',
        '     <div class="dl_dialog_btn">',

        '              <div>',
        '     </div>',
        '</div>'].join('');
      // $("#submitbtn").click(function () {
      $.modal(html, {
        containerCss: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          padding: 0,
          width: '230px'
        },
        onClose: function () {
          $.modal.close();
          location.reload();
        }
      });

      function a() {
        $.modal.close();
      }

      setTimeout(a, 2000);

      // });
    };
    // 登陆后将同意过的协议传给后端
    var setPrivacyTag = function() {
      var keys = [];
      if(window.isServiceTerms === "True") {
        keys.push('Old_Privacy_Key');
      } 
      if(window.privacyPolicyEnable === "True") {
        keys.push('Uniqlo_Privacy_Policy_Key');
      }
      $.ajax({
        url: '/Portal/Account/SetPrivacyPolicyTag',
        method: 'post',
        data: {
          keys: keys
        }
      })
    }
    var form_phone = $('#registPhoneForm').ajaxForm({
      dataType: 'json',
      beforeSerialize: function ($form, options) {
        var jsonResultHidden = form_phone.find('input:hidden[name=JsonResult]').val(true);
        if (!jsonResultHidden.length) {
          jsonResultHidden = $('<input type="hidden" name="JsonResult" value="true"/>').appendTo(form_phone);
        }
      },
      beforeSubmit: function(submitDataArr){
        var phonePass = _.findWhere(submitDataArr, { 'name': 'PhonePass' });
        var confirmPhonePassword = _.findWhere(submitDataArr, { 'name': 'ConfirmPhonePassword' });
        if (phonePass) {
          //获取加密安全码
          $.ajax({
            url: '/User/Account/GetEncryptionKey?_t'+(+new Date())
            , type: 'GET'
            , async: false
            , error: function () {
              throw new Error('getEncryptionKey is error');
            }
            , success: function (resp) {
              var key = resp.ValidataCode, iv = resp.IPAddess;
              key = CryptoJS.enc.Utf8.parse(key);
              iv = CryptoJS.enc.Utf8.parse(iv);
              // DES 加密
              var encrypted = CryptoJS.DES.encrypt(phonePass.value, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
              });
              phonePass.value = encrypted.toString();

              //加密验证密码
              var encryptedCPass = CryptoJS.DES.encrypt(confirmPhonePassword.value, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
              });
              confirmPhonePassword.value = encryptedCPass.toString();
            }
          });
        }
      },
      success: function (response, textStatus) {
        if (response.Success) {
          setPrivacyTag();
          if (response.RedirectUrl) {
            if (window.location.href != response.RedirectUrl) {
              OpenTips();
              window.location.href = response.RedirectUrl;
            } else {
              OpenTips();
              window.location.href = window.defaultUrl;
            }
          } else {
            window.location.href = window.defaultUrl;
          }
        } else {
          //每次错误只提示一条，默认提示错误信息的第一条
          if (response.FieldErrors[0].ErrorMessage == 'SMS_code_error') {
            $('.error_code').text(i18n.SMS_code_error);
            $('.error_code').show();
            $('.error_limit').hide();
            $('.send_limit').hide();
          }
          if (response.FieldErrors[0].ErrorMessage == 'error_limit') {
            $('.error_code').text(i18n.error_limit);
            $('.error_code').show();
            $('.error_limit').hide();
            $('.send_limit').hide();
          }
          if (response.FieldErrors[0].ErrorMessage == 'OneMinuteLimit') {
            $('.error_code').text(i18n.time_limit);
            $('.error_code').show();
            $('.error_limit').hide();
            $('.send_limit').hide();
          }
          // 密码后台校验
          if (response.FieldErrors[0].ErrorMessage == 'psw_validate_error') {
            $('#registPhoneForm #PhonePass').next().text(i18n.pwd_tip);
            $('#registPhoneForm #PhonePass').next().show();
          }
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('error');
      }
    });
    //国外手机号
    var form_phone = $('#registInterForm').ajaxForm({
      dataType: 'json',
      beforeSerialize: function ($form, options) {
        var jsonResultHidden = form_phone.find('input:hidden[name=JsonResult]').val(true);
        if (!jsonResultHidden.length) {
          $('<input type="hidden" name="RememberMe" value="true"/>').appendTo(form_phone);
          jsonResultHidden = $('<input type="hidden" name="JsonResult" value="true"/>').appendTo(form_phone);
        }
      },
      beforeSubmit: function (submitDataArr) {
        var phonePass = _.findWhere(submitDataArr, { 'name': 'PhonePass' });
        var confirmPhonePassword = _.findWhere(submitDataArr, { 'name': 'ConfirmPhonePassword' });
        if (phonePass) {
          //获取加密安全码
          $.ajax({
            url: '/User/Account/GetEncryptionKey'
            , type: 'GET'
            , async: false
            , error: function () {
              throw new Error('getEncryptionKey is error');
            }
            , success: function (resp) {
              var key = resp.ValidataCode, iv = resp.IPAddess;
              key = CryptoJS.enc.Utf8.parse(key);
              iv = CryptoJS.enc.Utf8.parse(iv);
              // DES 加密
              var encrypted = CryptoJS.DES.encrypt(phonePass.value, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
              });
              phonePass.value = encrypted.toString();

              //加密验证密码
              var encryptedCPass = CryptoJS.DES.encrypt(confirmPhonePassword.value, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
              });
              confirmPhonePassword.value = encryptedCPass.toString();
            }
          });
        }
      },
      success: function (response, textStatus) {
        if (response.Success) {
          setPrivacyTag();
          if (response.RedirectUrl) {
            if (window.location.href != response.RedirectUrl) {
              OpenTips();
              window.location.href = response.RedirectUrl;
            } else {
              OpenTips();
              window.location.href = window.defaultUrl;
            }
          } else {
            window.location.href = window.defaultUrl;
          }
        } else {
          //var msgStr = '';
          //for (var i = 0; i < response.Messages.length; i++) {
          //    msgStr += response.Messages[i] + '\r\n';
          //}

          //var validator = form.validate();
          ////var errors = [];
          //for (var i = 0; i < response.FieldErrors.length; i++) {
          //    var obj = {};
          //    var i18n_err_msg = response.FieldErrors[i].ErrorMessage;
          //    obj[response.FieldErrors[i].FieldName] = window.i18n[i18n_err_msg];
          //    validator.showErrors(obj);
          //}
          //每次错误只提示一条，默认提示错误信息的第一条
          //   if (response.FieldErrors[0].ErrorMessage == "SMS_code_error") {
          //        $(".error_code").text(i18n.SMS_code_error);
          //       $(".error_code").show();
          //       $('.error_limit').hide();
          //      $('.send_limit').hide();
          //  }
          //  if (response.FieldErrors[0].ErrorMessage == "error_limit") {
          //      $(".error_code").text(i18n.error_limit);
          //      $(".error_code").show();
          //      $('.error_limit').hide();
          //      $('.send_limit').hide();
          //  }
          //  if (response.FieldErrors[0].ErrorMessage == "OneMinuteLimit") {
          //      $(".error_code").text(i18n.time_limit);
          //      $(".error_code").show();
          //      $('.error_limit').hide();
          //      $('.send_limit').hide();
          //  }
          // 密码后台校验
          if (response.FieldErrors[0].ErrorMessage == 'psw_validate_error') {
            $('#registInterForm #PhonePass').next().text(i18n.pwd_tip);
            $('#registInterForm #PhonePass').next().show();
          }
          if (response.FieldErrors[0].ErrorMessage == 'OneMinuteLimit') {
            response.FieldErrors[0].ErrorMessage = 'time_limit';
          }
          if (response.FieldErrors.length !== 0) {

            if (window.hikvision && i18n[response.FieldErrors[0].ErrorMessage] == '手机号已被注册，请直接登录') {
              i18n[response.FieldErrors[0].ErrorMessage] = '';
              $('.error_code_inter').text(i18n[response.FieldErrors[0].ErrorMessage]);
              $('.error_code_inter').hide();
            } else {
              $('.error_code_inter').show();
              $('.error_code_inter').text(i18n[response.FieldErrors[0].ErrorMessage]);
            }


            //刷新验证码
            // document.getElementById('pre_phone_code_new').src = '//' + window.location.hostname + '/User/Account/GetValidateCode?=' + new Date().getTime();
          }
          !!gtTestIns && gtTestIns.reset();
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        !!gtTestIns && gtTestIns.reset();
        alert('error');
      }
    });
    $('.tab_mobile').click(function () {
      $('#Checkidphone').attr('checked', false);
      if ($('#proId').attr('newid') !== 'False') {
        $('#submitbutton_phone').hide();
        $('#unsubmitbutton_phone').show();
      }
      $('.tab_email').removeClass('selected_color');
      $('.tab_mobile').addClass('selected_color');
      $('#registInterForm').hide();
      $('#registPhoneForm').show();
      $('.geetest_error').hide();
    });
    $('.tab_email').click(function () {
      $('#Checkid').attr('checked', false);
      if ($('#proId').attr('newid') !== 'False') {
        $('#submitbutton').hide();
        $('#unsubmitbutton').show();
      }
      $('.tab_mobile').removeClass('selected_color');
      $('.tab_email').addClass('selected_color');
      $('#registInterForm').show();
      // document.getElementById('pre_phone_code_new').src = '//' + window.location.hostname + '/User/Account/GetValidateCode?=' + new Date().getTime();
      $('#registPhoneForm').hide();
      $('.geetest_error').hide();
    });
    $('#verifyCode_pop').keypress(function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        return false;
      }
    });
    $('.smscode_new').bind('input propertychange', function () {
      $('.error_limit').hide();
      $('.error_code').hide();
      $('.send_limit').hide();
      $('.error_code_inter').hide();
      $('.geetest_error').hide();
    });

    $('.send_smscode').click(function () {
      //点击发送短信验证码
      if (!allowSend) return false;
      var phoneNumber = parseInt($('#phoneNum').val());
      var validPhoneNum = window.mobileRegexStr.test(phoneNumber);
      if (validPhoneNum) {
        $.ajax({
          url: '/User/Account/GetPhoneValidateStatus',
          type: 'GET',
          data: { mobile: phoneNumber, businessType: 1 },
          error: function () {
            throw new Error('getEncryptionKey is error');
          },
          success: function (resp) {
            //resp.Data = false;
            if (resp.Data) {
              // 手机号校验
              currentValidateMode = GT_VALIDATE.TYPE_DOMESTIC_PHONE_OCCUPIED;
              gtTestIns.verify();
            } else {
              //resp.Message = "error_limit";
              if (resp.Message == 'error_limit') {
                $('.error_limit').show();
                $('.send_limit').hide();
                $('.error_code').hide();
              }
              if (resp.Message == 'send_limit') {
                $('.send_limit').show();
                $('.error_limit').hide();
                $('.error_code').hide();
              }
              if (resp.Message == 'OneMinuteLimit') {
                $('.error_limit').text(i18n.time_limit);
                $('.error_limit').show();
                $('.send_limit').hide();
                $('.error_code').hide();
              }
            }
          }
        });
      }
    });
    $('.cancel').click(function () {
      $.modal.close();
    });
    $('.confirm').click(function () {
      //if (!$('#codeform').valid()) return false;
      var mobile = $('#phoneNum').val();
      var verifyCode = $('#verifyCode_pop').val();
      $.ajax({
        url: '/User/Account/SendSMSVerification'
        , type: 'POST'
        , data: { mobile: mobile, verifyCode: verifyCode, businessType: 1 }
        , async: false
        , error: function () {
          throw new Error('getEncryptionKey is error');
        }
        , success: function (resp) {
          if (!resp.Data) {
            $('.mask').find('.error_limit').show();
            //错误时刷新验证码
            $('#pre_phone_code').click();
          } else {
            $.modal.close();
            countDown();
          }
        }
      });
      //  $.modal.close();
    });


    $(function () {
      //判断是否为英文，如果是修改分隔符的样式
      if (window.i18n.edit.indexOf('Edit') !== -1) {
        $('.dot').css('margin-bottom', '10px');
      }
      document.title = window.i18n.reg;

      function OpenTips() {
        var html = ['<div class="dl_dialog1">',
          '     <div class="dl_dialog_wrap">',
          '       <div class="dl_tocenter">',
          '<span class="dl_dialog_icook dl_ft14_grey2"><b>' + window.i18n.reg_success + '</b>',//注册成功
          '</span>',
          '</div>',
          '     <div class="dl_dialog_btn">',

          '              <div>',
          '     </div>',
          '</div>'].join('');
        // $("#submitbtn").click(function () {
        $.modal(html, {
          containerCss: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            padding: 0,
            width: '230px'
          },
          onClose: function () {
            $.modal.close();
            location.reload();
          }
        });

        function a() {
          $.modal.close();
        }

        setTimeout(a, 2000);

        // });
      };
      var form = $('#registForm').ajaxForm({
        dataType: 'json',
        beforeSerialize: function ($form, options) {
          var jsonResultHidden = form.find('input:hidden[name=JsonResult]').val(true);
          if (!jsonResultHidden.length) {
            jsonResultHidden = $('<input type="hidden" name="JsonResult" value="true"/>').appendTo(form);
          }
        },
        success: function (response, textStatus) {
          if (response.Success) {
            setPrivacyTag();
            if (response.RedirectUrl) {
              if (window.location.href != response.RedirectUrl) {
                OpenTips();
                window.location.href = response.RedirectUrl;
              } else {
                OpenTips();
                window.location.href = window.defaultUrl;
              }
            } else {
              window.location.href = window.defaultUrl;
            }
          } else {
            var msgStr = '';
            for (var i = 0; i < response.Messages.length; i++) {
              msgStr += response.Messages[i] + '\r\n';
            }

            var validator = form.validate();
            //var errors = [];
            for (var i = 0; i < response.FieldErrors.length; i++) {
              var obj = {};
              var i18n_err_msg = response.FieldErrors[i].ErrorMessage;
              obj[response.FieldErrors[i].FieldName] = window.i18n[i18n_err_msg];
              validator.showErrors(obj);
            }
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert('error');
        }
      });

      //$("#UserName").click(function() {
      //    if ($(this).val() == '请输入电子邮箱') {
      //        $(this).val("");
      //    }
      //});

      //$("#UserName").blur(function () {
      //    if ($(this).val() == '') {
      //        $(this).val("请输入电子邮箱");
      //    }
      //});
      $('#Checkid').click(function () {
        if ($('#Checkid').is(':checked')) {
          $('#submitbutton').show();
          $('#unsubmitbutton').hide();
        } else {
          $('#submitbutton').hide();
          $('#unsubmitbutton').show();
        }
      });
      $('#Checkidphone').click(function () {
        if ($('#Checkidphone').is(':checked')) {
          $('#submitbutton_phone').show();
          $('#unsubmitbutton_phone').hide();
        } else {
          $('#submitbutton_phone').hide();
          $('#unsubmitbutton_phone').show();
        }
      });

      $('#UserName').blur(function () {//失去焦点时触发
        var userName = $('#UserName').val();

        //判断是否符合邮箱格式，别的地方已经做得错误信息提示，木有找到位置，其实是想统一处理的
        //请输入电子邮箱
        if (userName != '' && userName != window.i18n.input_email_tip && /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(userName)) {
          $.post('RegisterValidate', { 'userName': userName }, function (data) {
            if (data) {
              var validator = form.validate();
              validator.showErrors({ UserName: i18n.email_exist_tip });
              $('.hademail').show();
            } else {

            }
          }, 'json');
        } else {
          $('#UserName').addClass('dl_dftgrey');
        }
      });
      $('#UserName').focus(function () {
        if ($('span[data-valmsg-for=\'UserName\']').length > 0 || $('span[data-valmsg-for=\'UserName\']').html() != '') {
          $('.validate').hide();
        }

      });
    });
  }());
  (function () {
    $('.sina,.qq').click(function () {
      var url = $(this).attr('url');
      window.open(url, 'newwindow', 'height=600, width=800, top=200, left=300, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no');
    });
    // 外国手机号码注册提交
    $('#submitbutton').click(function () {
      if ($('#registInterForm').valid()) {
        currentValidateMode = GT_VALIDATE.TYPE_FOREIGN_PHONE_OCCUPIED;
        !!gtTestIns && gtTestIns.verify();
      }
    });
    // 国内手机号注册提交
    $('#submitbutton_phone').click(function (e) {
      e.preventDefault();
      if ($('#registPhoneForm').valid()) {
        $('#registPhoneForm').submit();
      }
    });


    // input事件监听
    $(function () {
      // 手机号码输入，取消所有错误提示
      $('.phoneNum').bind('input propertychange', function (event) {

        // 如果是国内手机号
        if ($('.tab_mobile').attr('class').indexOf('selected_color') !== -1) {
          $('#registPhoneForm .hasphone').hide();
        }
        // 如果是国外手机号tab
        if ($('.tab_email').attr('class').indexOf('selected_color') !== -1) {
          $('#registInterForm .hasphone').hide();
        }
        // 发送限制错误提示
        $('.send_limit').hide();
        // 错误限制错误提示
        $('.error_limit').hide();
        // 极验错误消失
        $('.geetest_error').hide();
        var phoneNum = parseInt($('#phoneNum').val());
        var validInterPhone = new RegExp(window.foreignMobileRegex).test($('#interPhoneNum').val());
        var validPhone = window.mobileRegexStr.test(phoneNum);

        // 如果处于发送之中，不修改颜色以及内容，也不允许发送
        if (isSending) return;
        // 如果是合法的手机号
        if (validPhone || validInterPhone) {
          allowSend = true;
          $('.send_smscode').css('backgroundColor', '#1687D9');
        } else {
          //发送验证码接口显示浅蓝色
          $('.send_smscode').css('backgroundColor', '#B9DBF3');
          $('.send_smscode').text(i18n.send_SMS_code);
        }
      });
    });
    $(function () {

      $('.dl_textinp').blur(function () {
        var node = $(this);
        var nodeVal = node.val();
        var nodeDefault = node.attr('defaultValue');
        if (nodeVal == '') {
          //node.val(nodeDefault);
          //node.addClass("dl_dftgrey");
        }
        var info = node.attr('info');
        if (info && info != '') {
          var name = node.attr('name');
          node.parent().find('span[data-valmsg-for="' + name + '"]').show();
          node.parent().find('span[name=\'inputinfo\']').remove();
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
        var info;
        // $("#passwordRegexType").val('1')
        if ($('#passwordRegexType').val() === '1' && node.attr('data-val-regex') === '您输入的密码不符合规范') { //0表示普通租户 1表示海康威视
          info = '密码8-20位，必须包含大小写字母、数字和特殊符号（不含空格）至少三种';
        } else {
          info = node.attr('info');
        }
        //var info = node.attr("info");
        if (info && info != '') {
          var name = node.attr('name');
          //var display = node.parents("span").find('span[data-valmsg-for="' + name + '"]').css("display");
          //if (display == "inline-block" || display == "block")
          //    return;
          if (node.parent().find('span[name="inputinfo"]').length == 0) {
            node.parent().find('span[data-valmsg-for="' + name + '"]').hide();
            $('<span name=\'inputinfo\' class=\'dl_ft14_grey\' style=\'display:inline-block;font-size:12px;color: #9AA8B3;\'>' + info + '</span>').insertAfter(node);
          }
        }
      });
    });
  }());
}());
