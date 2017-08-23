'use stricts';
angular.module('ionicApp.controllers', [])

.controller('HomeCtrl', function($ionicPopover, $rootScope, $cordovaDevice, $ionicLoading, $ionicPlatform, $scope, $ionicPopup, $cordovaStatusbar, $cordovaSQLite, $http, $cordovaFile, SQL) {

    $('.title').click(function() {
        $scope.lesson(false);
    });
    $ionicPlatform.ready(function() {
        var save_location = "";
        if ($cordovaDevice.getPlatform() === "Android") {
            save_location = cordova.file.applicationStorageDirectory + 'databases/';
        } else {
            // save_location = cordova.file.documentsDirectory;
            save_location = cordova.file.applicationStorageDirectory;
        }
        $cordovaFile.checkFile(save_location, "directions.db")
            .then(function() {
                setTimeout(function() {
                    home_init();
                }, 2000);
            }, function() {
                setTimeout(function() {
                    home_init();
                }, 2000);
            });
    });

    function home_init() {
        var query_user = "SELECT * FROM user_db WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {
            $scope.lang = res.rows.item(0).lang;
            if (res.rows.item(0).lang === 'cht') {
                setTimeout(function() {
                    $scope.home_title = "方向指引";
                }, 500);
                $scope.home_title = "方向指引";
                version_select('article_cht');
            } else if (res.rows.item(0).lang === 'en') {
                setTimeout(function() {
                    $scope.home_title = "Directions";
                }, 500);
                $scope.home_title = "Directions";
                version_select('article_en');
            } else if (res.rows.item(0).lang === 'chs') {
                setTimeout(function() {
                    $scope.home_title = "方向指引";
                }, 500);
                $scope.home_title = "方向指引";
                version_select('article_chs');
            }
            $('.nav_bar_color').addClass(res.rows.item(0).bar_color_mode);
            $('#tabs_color').addClass(res.rows.item(0).tabs_color_mode);
        }, function(error) {
            console.log(error);
        });

        function version_select(article_version) {
            var query = "SELECT * FROM " + article_version + " WHERE h_where = 1000";
            $cordovaSQLite.execute(db, query).then(function(res) {
                $scope.lesson_data = [];
                var lesson_data = [];
                for (i = 0; i < res.rows.length; i++) {
                    lesson_data.push(res.rows.item(i));
                }
                $scope.lesson_data = lesson_data;
                setTimeout(function() {
                    $ionicLoading.hide();
                }, 1000);
            }, function(err) {
                alert('err');
            });
        }

    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        home_init();
    });
})

.controller('MyCtrl', function($ionicPopover, $rootScope, $scope, $ionicHistory, $ionicModal, $cordovaSQLite) {
    MyCtrl_init();
    $scope.Home_tabs_title = "Home";
    $scope.Setting_tabs_title = "Settings";
    $scope.More_tabs_title = "More";

    function MyCtrl_init() {
        setTimeout(function() {
            $cordovaSQLite.execute(db, "SELECT * FROM user_db WHERE username = 'Bill' ").then(function(res) {
                $scope.size = {
                    value: res.rows.item(0).font_size
                };
                if (res.rows.item(0).lang === 'cht') {
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.Home_tabs_title = "首頁";
                            $scope.Setting_tabs_title = "設定";
                            $scope.More_tabs_title = "更多";
                        });
                    }, 100);
                } else if (res.rows.item(0).lang === 'en') {
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.Home_tabs_title = "Home";
                            $scope.Setting_tabs_title = "Settings";
                            $scope.More_tabs_title = "More";
                        });
                    }, 100);
                } else if (res.rows.item(0).lang === 'chs') {
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.Home_tabs_title = "首页";
                            $scope.Setting_tabs_title = "设定";
                            $scope.More_tabs_title = "更多";
                        });
                    }, 100);
                }
            });
        }, 100);
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        MyCtrl_init();
    });
    //這是MyCtrl裡面的change_font，即popover的
    $scope.change_font = function(font_type, type) {
        var query_user = "UPDATE user_db SET font_type = '" + font_type + "' WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {
            $('#lesson_content').css({
                fontFamily: font_type
            });
            $('#more_detail_content').css({
                fontFamily: font_type
            });
        });
        font_color_change(type);

        function font_color_change(type) {
            $cordovaSQLite.execute(db, "SELECT * FROM user_db WHERE username = 'Bill' ").then(function(res) {
                type_a = Number(type);
                for (i = 0; i < 8; i++) {
                    if (i === type_a) {
                        $('#font' + type).css({
                            color: res.rows.item(0).color_hex
                        });
                        $('#font' + type).addClass('selected');
                    } else {
                        $('#font' + i).css({
                            color: '#9596A0'
                        });
                        $('#font' + i).removeClass('selected');
                    }
                }
            });
        }
    };
    $scope.setLevelText = function(size) {
        var query_user = "UPDATE user_db SET font_size = " + size + " WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {
            $('#lesson_content').css({
                fontSize: size + 'px'
            });
            $('#more_detail_content').css({
                fontSize: size + 'px'
            });
            $('textarea').css({
                fontSize: size + 'px',
            });
        });
    };

    $scope.MoreTab = function() {
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.font_pop = true;
            });
        }, 100);
    };
    $scope.homeTab = function() {
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.font_pop = true;
            });
        }, 100);
    };
    $scope.SettingsTab = function() {
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.font_pop = false;
            });
        }, 100);
    };
    $scope.font = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.back = function() {
        $ionicHistory.goBack();
    };
    $scope.openPopover = function($event) {
        $scope.popover.show($event);
        setTimeout(function() {
            var query_user = "SELECT * FROM user_db WHERE username = 'Bill' ";
            $cordovaSQLite.execute(db, query_user).then(function(res) {
                $('.font_range_color').removeClass('range-' + res.rows.item(0).color_ionic);
                $('.font_range_color').addClass('range-' + res.rows.item(0).color_ionic);
                for (i = 0; i < 8; i++) {
                    if ($('#font' + i).hasClass('selected')) {
                        $('#font' + i).css({
                            color: res.rows.item(0).color_hex
                        });
                    }
                }
            });
        }, 100);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });
    $ionicPopover.fromTemplateUrl('templates/my-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $ionicModal.fromTemplateUrl('templates/my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

})

.controller('MoreCtrl', function($scope, $cordovaSQLite) {
    More_init();

    function More_init() {
        var query_user = "SELECT * FROM user_db WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {
            if (res.rows.item(0).lang === 'cht') {
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.more_title = "更多";
                    });
                }, 500);
                version_select('article_cht');
            } else if (res.rows.item(0).lang === 'en') {
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.more_title = "More";
                    });
                }, 500);
                version_select('article_en');
            } else if (res.rows.item(0).lang === 'chs') {
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.more_title = "更多";
                    });
                }, 500);
                version_select('article_chs');
            }
        });

        function version_select(article_version) {
            var more_list_data = [];
            var query2 = "SELECT * FROM " + article_version + " WHERE h_where = 0 ORDER BY h_id";
            $cordovaSQLite.execute(db, query2).then(function(res) {
                for (i = 0; i < res.rows.length; i++) {
                    more_list_data.push(res.rows.item(i));
                }
                $scope.more_list_data = more_list_data;

            }, function(err) {
                alert(err);
            });
        }
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        More_init();
    });
})

.controller('MoreDetailsCtrl', function($scope, $cordovaSQLite, $stateParams, Bible_api) {
    More_detail_init();

    function More_detail_init() {
        var query_user = "SELECT * FROM user_db WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {
            if (res.rows.item(0).lang === 'cht') {
                version_select('article_cht');
            } else if (res.rows.item(0).lang === 'en') {
                version_select('article_en');
            } else if (res.rows.item(0).lang === 'chs') {
                version_select('article_chs');
            }
            setTimeout(function() {
                $('#more_detail_content').css({
                    fontSize: res.rows.item(0).font_size + 'px',
                    fontFamily: res.rows.item(0).font_type
                });
            }, 100);

        });

        function version_select(article_version) {
            var query = "SELECT * FROM " + article_version + " WHERE h_where = '" + $stateParams.h_go + "' ORDER BY h_id";
            $cordovaSQLite.execute(db, query).then(function(res) {
                var more_list_detail = [];
                for (i = 0; i < res.rows.length; i++) {
                    more_list_detail.push(res.rows.item(i));
                }
                $scope.more_list_detail = more_list_detail;
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.more_title = $stateParams.h_text;
                    });
                }, 500);
            }, function(err) {
                alert(err);
            });
        }
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        More_detail_init();
    });


})

.controller('SettingCtrl', function($ionicPlatform, $cordovaFile, $rootScope, $ionicHistory, $scope, $cordovaSQLite) {
    Setting();

    function Setting() {
        var query_user = "SELECT * FROM user_db WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {

            $scope.font_size = res.rows.item(0).font_size;
            $scope.font = res.rows.item(0).font_type;
            $scope.lang = res.rows.item(0).lang;
            setTimeout(function() {
                $('.note_color').css({
                    backgroundColor: res.rows.item(0).color_hex
                });
            }, 200);
            if (res.rows.item(0).lang === 'cht') {
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.font_size_title = "字體大小";
                        $scope.setting_title = "設定";
                        $scope.setting_color_title = "色彩主題";
                        $scope.setting_lang_title = "語言";
                        $scope.setting_font_type_title = "字體";
                    });
                }, 500);
            } else if (res.rows.item(0).lang === 'en') {
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.font_size_title = "Font Size";
                        $scope.setting_title = "Settings";
                        $scope.setting_color_title = "Color Theme";
                        $scope.setting_lang_title = "Language";
                        $scope.setting_font_type_title = "Font";
                    });
                }, 500);
            } else if (res.rows.item(0).lang === 'chs') {
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.font_size_title = "字体大小";
                        $scope.setting_title = "设定";
                        $scope.setting_color_title = "色彩主题";
                        $scope.setting_lang_title = "语言";
                        $scope.setting_font_type_title = "字体";
                    });
                }, 500);
            }
        });
    }
    $scope.doRefresh = function() {
        Setting();
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.lang_setting = function(lang) {
        var query_user = "UPDATE user_db SET lang = '" + lang + "' WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {
            $ionicHistory.goBack();
        });
    };
    $scope.color_setting = function(color_hex, bar_color, tabs_color, color_ionic) {

        var query_user1 = "SELECT * FROM user_db WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user1).then(function(res) {
            $('.font_range_color').removeClass('range-' + res.rows.item(0).color_ionic);
            $('.nav_bar_color').removeClass(res.rows.item(0).bar_color_mode);
            $('#tabs_color').removeClass(res.rows.item(0).tabs_color_mode);
        });
        var query_user = "UPDATE user_db SET bar_color_mode = '" + bar_color + "', tabs_color_mode= '" + tabs_color + "', color_hex= '" + color_hex + "' , color_ionic= '" + color_ionic + "' WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {
            $('.font_range_color').addClass('range-' + color_ionic);
            $('.nav_bar_color').addClass(bar_color);
            $('#tabs_color').addClass(tabs_color);
        });
        // $rootScope.viewColor = color_hex;
    };
    $scope.font_size_setting = function(size) {
        var query_user = "UPDATE user_db SET font_size = " + size + " WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {
            $ionicHistory.goBack();
            $('#lesson_content').css({
                fontSize: size + 'px'
            });
            // $('.bible_content').css({
            //     fontSize: size + 'px'
            // });
        });
    };
    //這是Setting裡面的change_font
    $scope.change_font = function(font_type, type) {
        var query_user = "UPDATE user_db SET font_type = '" + font_type + "' WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {
            $ionicHistory.goBack();
            $('#lesson_content').css({
                fontFamily: font_type
            });
            $('#more_detail_content').css({
                fontFamily: font_type
            });
        });
    };
    $ionicPlatform.ready(function() {
        $scope.backup = function() {
            $cordovaFile.removeFile(cordova.file.externalDataDirectory, "directions.db")
                .then(function(success) {
                    // success
                    // alert('success:' + JSON.stringify(success));
                    // alert('移除成功，有先移除/database中的directions.db');
                }, function(error) {
                    // alert('error:' + JSON.stringify(error));
                    // alert('移除失敗，有先移除/database中的directions.db');
                });
            $cordovaFile.copyFile(cordova.file.applicationStorageDirectory + 'databases/', "directions.db", cordova.file.externalDataDirectory, "directions.db")
                .then(function(success) {
                    // alert('success:' + JSON.stringify(success));
                    // success
                    // alert('移除成功，有先移除sdcard中的directions.db');
                }, function(error) {
                    // alert('error:' + JSON.stringify(error));
                    // alert('移除失敗，有先移除sdcard中的directions.db');
                });
            alert("Your backUp is success and save in sdcard");
        };
        $scope.update = function() {
            $cordovaFile.removeFile(cordova.file.applicationStorageDirectory + 'databases/', "directions.db")
                .then(function(success) {
                    // success
                    // alert('success:' + JSON.stringify(success));
                    // alert('移除成功，有先移除/database中的directions.db');
                }, function(error) {
                    // alert('error:' + JSON.stringify(error));
                    // alert('移除失敗，有先移除/database中的directions.db');
                });
            $cordovaFile.copyFile(cordova.file.externalDataDirectory, "directions.db", cordova.file.applicationStorageDirectory + 'databases/', "directions.db")
                .then(function(success) {
                    // alert('success:' + JSON.stringify(success));
                    // success
                    // alert('移除成功，有先移除sdcard中的directions.db');
                }, function(error) {
                    // alert('error:' + JSON.stringify(error));
                    // alert('移除失敗，有先移除sdcard中的directions.db');
                });
            alert("將會重新開啟應用程式");
            setTimeout(function() {
                ionic.Platform.exitApp();
            }, 500);

        };
    });
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        Setting();
    });

})

.controller('LessonCtrl', function($rootScope, $scope, $cordovaSQLite, $stateParams, $ionicSideMenuDelegate, Bible_api, $q) {
    $rootScope.font_pop = true;
    $scope.doRefresh = function() {
        LessonList_init();
        $scope.$broadcast('scroll.refreshComplete');
    };

    function LessonList_init() {
        var query_user = "SELECT * FROM user_db WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {
            $scope.lang = res.rows.item(0).lang;
            if (res.rows.item(0).lang === 'cht') {
                return version_select('article_cht', 'cht');
            } else if (res.rows.item(0).lang === 'en') {
                return version_select('article_en', 'en');
            } else if (res.rows.item(0).lang === 'chs') {
                return version_select('article_chs', 'chs');
            }
        });
    }
    function version_select(article_version, lang) {
        var query = "SELECT * FROM " + article_version + " WHERE h_where = '" + $stateParams.h_go + "' ORDER BY h_id";
        return $cordovaSQLite.execute(db, query).then(showLessonContent.bind(Bible_api, lang));
    }
    function showLessonContent (lang , res) {
        $scope.lesson_data = [];
        var lesson_data = [];
        for (i = 0; i < res.rows.length; i++) {
            lesson_data.push(res.rows.item(i));
        }
        $scope.lesson_data = lesson_data;
        setTimeout(function() {
            const lesson_title = function() {
                if (lang ==='cht') {
                    return  "第" + this.Bible_api.transfer_number($stateParams.h_go.slice(1, 3)) + "課";
                } else if (lang === 'chs') {
                    return  "第" + this.Bible_api.transfer_number($stateParams.h_go.slice(1, 3)) + "课";
                } else if (lang === 'en'){
                    return "Lesson" + $stateParams.h_go.slice(1, 3)
                }
            };
            $scope.lesson_title = lesson_title();
        }.bind(this), 300);
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        LessonList_init();
    });

})

.controller('LessonContentCtrl', function($ionicModal, $compile, $scope, $cordovaSQLite, $stateParams, $ionicSideMenuDelegate, Bible_api , $q, $cordovaSocialSharing) {
    
    function LessonContent() {
        return $q(function(resolve, reject) {
            setting_lang();
            setTimeout(function() {
               resolve($('#lesson_content').html());
            }, 200);
        });
    }
    function setting_lang(){
        $scope.shareButton = true;
        var query_user = "SELECT * FROM user_db WHERE username = 'Bill' ";
        $cordovaSQLite.execute(db, query_user).then(function(res) {
            if (res.rows.item(0).lang === 'cht') {
                return [res.rows.item(0).lang, 'article_cht', res.rows.item(0).font_size, res.rows.item(0).font_type];
              } else if (res.rows.item(0).lang === 'en') {
                return [res.rows.item(0).lang, 'article_en', res.rows.item(0).font_size, res.rows.item(0).font_type];
              } else if (res.rows.item(0).lang === 'chs') {
                return [res.rows.item(0).lang, 'article_chs', res.rows.item(0).font_size, res.rows.item(0).font_type];
              }
          }).then(function(arr) {
            content_version_select(arr[0], arr[1], arr[2], arr[3]);
          });
    }
    function content_version_select(lang, article_version, size, font_type) {
            $('#lesson_content').empty();
            var query = "SELECT * FROM " + article_version + " WHERE h_where = '" + $stateParams.h_go + "' ORDER BY h_id";
            $cordovaSQLite.execute(db, query).then(function(res) {
                    var html = "";
                    var temp;
                    B_id = 1;
                    B_flag = 1;
                    textarea = 0;
                    table_count = 1;
                    for (i = 0; i < res.rows.length; i++) {
                        switch (res.rows.item(i).h_format) {
                            case 0:
                                html = '<hr>';
                                temp = $compile(html)($scope);
                                angular.element(document.getElementById('lesson_content')).append(temp);
                                html = "";
                                temp = "";
                                break;
                            case 1:
                                html = '<center><b>' + res.rows.item(i).h_text + '</b></center><br>';
                                temp = $compile(html)($scope);
                                angular.element(document.getElementById('lesson_content')).append(temp);
                                html = "";
                                temp = "";
                                break;
                            case 2:
                                html = '<BP>' + res.rows.item(i).h_text + '</BP>';
                                temp = $compile(html)($scope);
                                angular.element(document.getElementById('lesson_content')).append(temp);
                                html = "";
                                temp = "";
                                break;
                            case 3:
                                if (lang === 'en') {
                                    html = '<a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'kjv\',\'' + res.rows.item(i).h_key + '\')" style="text-decoration:none;">' + res.rows.item(i).h_text + '</a><a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'cht\',\'' + res.rows.item(i).h_desc + '\')" style="text-decoration:none;"> ｜ [中] </a>';
                                    temp = $compile(html)($scope);
                                    angular.element(document.getElementById('lesson_content')).append(temp);
                                    html = "";
                                    temp = "";
                                } else if (lang === 'cht') {
                                    html = '<a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'cht\',\'' + res.rows.item(i).h_desc + '\')" style="text-decoration:none;">' + res.rows.item(i).h_text + '</a><a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'kjv\',\'' + res.rows.item(i).h_key + '\')" style="text-decoration:none;"> ｜ [英] </a>';
                                    temp = $compile(html)($scope);
                                    angular.element(document.getElementById('lesson_content')).append(temp);
                                    html = "";
                                    temp = "";
                                } else if (lang === 'chs') {
                                    html = '<a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'chs\',\'' + res.rows.item(i).h_desc + '\')" style="text-decoration:none;">' + res.rows.item(i).h_text + '</a><a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'kjv\',\'' + res.rows.item(i).h_key + '\')" style="text-decoration:none;"> ｜ [英] </a>';
                                    temp = $compile(html)($scope);
                                    angular.element(document.getElementById('lesson_content')).append(temp);
                                    html = "";
                                    temp = "";
                                }
                                B_id++;
                                break;
                            case 4:
                                html = '<p>' + res.rows.item(i).h_text + '</p><br>';
                                temp = $compile(html)($scope);
                                angular.element(document.getElementById('lesson_content')).append(temp);
                                html = "";
                                temp = "";
                                break;
                            case 5:
                                html = '<ul class="bullet" ><li>' + res.rows.item(i).h_text + '</li></ul><br>';
                                temp = $compile(html)($scope);
                                angular.element(document.getElementById('lesson_content')).append(temp);
                                html = "";
                                temp = "";
                                break;
                            case 6:
                                if (B_flag == 1) {
                                    html = '<BP>' + res.rows.item(i).h_text + '</BP>';
                                    temp = $compile(html)($scope);
                                    angular.element(document.getElementById('lesson_content')).append(temp);
                                    html = "";
                                    temp = "";
                                    B_flag++;
                                } else if (B_flag == 2) {
                                    if (lang === 'en') {
                                        html = '<a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'kjv\',\'' + res.rows.item(i).h_key + '\')" style="text-decoration:none;">' + res.rows.item(i).h_text + '</a><a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'cht\',\'' + res.rows.item(i).h_desc + '\')" style="text-decoration:none;"> ｜ [中] </a>';
                                        temp = $compile(html)($scope);
                                        angular.element(document.getElementById('lesson_content')).append(temp);
                                        html = "";
                                        temp = "";
                                    } else if (lang === 'cht') {
                                        html = '<a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'cht\',\'' + res.rows.item(i).h_desc + '\')" style="text-decoration:none;">' + res.rows.item(i).h_text + '</a><a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'kjv\',\'' + res.rows.item(i).h_key + '\')" style="text-decoration:none;"> ｜ [英] </a>';
                                        temp = $compile(html)($scope);
                                        angular.element(document.getElementById('lesson_content')).append(temp);
                                        html = "";
                                        temp = "";
                                    } else if (lang === 'chs') {
                                        html = '<a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'chs\',\'' + res.rows.item(i).h_desc + '\')" style="text-decoration:none;">' + res.rows.item(i).h_text + '</a><a ng-click="Bible(\'' + res.rows.item(i).h_key + '\',\'kjv\',\'' + res.rows.item(i).h_key + '\')" style="text-decoration:none;"> ｜ [英] </a>';
                                        temp = $compile(html)($scope);
                                        angular.element(document.getElementById('lesson_content')).append(temp);
                                        html = "";
                                        temp = "";
                                    }
                                    B_flag++;
                                    B_id++;
                                } else if (B_flag == 3) {
                                    html = '<BP>' + res.rows.item(i).h_text + '</BP><p></p><br>';
                                    temp = $compile(html)($scope);
                                    angular.element(document.getElementById('lesson_content')).append(temp);
                                    html = "";
                                    temp = "";
                                    B_flag = 1;
                                }
                                break;
                            case 7:
                                html = '<textarea style="height:80px;" id=' + res.rows.item(i).h_id + '  ng-keyup="autoExpand($event)" name =' + $stateParams.h_go + article_version + '></textarea><br>';
                                temp = $compile(html)($scope);
                                angular.element(document.getElementById('lesson_content')).append(temp);
                                angular.element(document.getElementById(res.rows.item(i).h_id)).append(res.rows.item(i).h_text);
                                html = "";
                                temp = "";
                                textarea++;
                                break;

                            case 8:
                                html = '<div class="table_border">' + res.rows.item(i).h_text + '</div><br>';
                                temp = $compile(html)($scope);
                                angular.element(document.getElementById('lesson_content')).append(temp);
                                html = "";
                                temp = "";
                                break;
                            case 9:
                                if (table_count == 1) {
                                    html = '<div class="table_border">' + res.rows.item(i).h_text + '</div>';
                                    temp = $compile(html)($scope);
                                    angular.element(document.getElementById('lesson_content')).append(temp);
                                    html = "";
                                    temp = "";
                                    table_count++;
                                } else if (table_count == 2) {
                                    html = '<div class="table_border">' + res.rows.item(i).h_text + '</div><br>';
                                    temp = $compile(html)($scope);
                                    angular.element(document.getElementById('lesson_content')).append(temp);
                                    html = "";
                                    temp = "";
                                    table_count = 1;
                                }
                                break;
                            case 10:
                                html = '<BP>' + res.rows.item(i).h_text + ' </BP><p></p><br>';
                                temp = $compile(html)($scope);
                                angular.element(document.getElementById('lesson_content')).append(temp);
                                html = "";
                                temp = "";
                                break;
                            case 11:
                                html = '<B> ' + res.rows.item(i).h_text + ' </B><br>';
                                temp = $compile(html)($scope);
                                angular.element(document.getElementById('lesson_content')).append(temp);
                                html = "";
                                temp = "";
                                break;
                        }
                    }
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.lesson_day_title = res.rows.item(0).h_text;
                            $scope.shareButton = false;
                        });
                    }, 400);
                    $('#lesson_content').css({
                        fontSize: size + 'px',
                        fontFamily: font_type
                    });
                    $('textarea').css({
                        fontSize: size + 'px',
                        fontFamily: font_type
                    });
            });
    }

    function getLessonQuestionsAndAnswers(content) {
        return $q(function(resolve, reject) {
           var pos = content.split('<br>');
           var check = [];
           var answer = {
               questions: [],
               answers: []
             };
           var myAnswer = '';
           pos.forEach(function (element, index, array) {
               if (element.search('<textarea') === 0) {
                   check.push(index - 1);
                   var start = element.search('>');
                   var end = element.search('</textarea');
                   answer.answers.push(element.slice(start + 1, end));
                 }
             });
           check.forEach(function (element, inedx, array) {
               if (pos[element].indexOf('class="bullet"') > 0) {
                   var arr = pos[element].split('</li>');
                   var b = arr[0].split('<li>');
                   answer.questions.push(b[1]);
                 } else {
                   answer.questions.push((pos[element]));
                 }
             });
           answer.questions.forEach(function(element, index, array) {
               myAnswer = myAnswer + '<b>' + (index + 1 ) + '.</b><b>' + element + '</b><p>'+ answer.answers[index] +'</p>';
           });
           resolve(myAnswer);
        });
    };

    $scope.shareAnywhere = function () {
        LessonContent().then(function(content) {
           return getLessonQuestionsAndAnswers(content);
        }).then(function(myAnswer) {
            $cordovaSocialSharing.shareViaEmail(myAnswer, 'Check out my answers from '+ $scope.lesson_day_title);
        });
    };
    /* const curry = (fn, ...args1) =>  (...args2) => fn(...args1, ...args2);
    function curry(fn, ...args1) {
        return (...args2) => fn(...args1, ...args2);
    }
    const dbquery = (connection,sql) =>{
        return 1
    }*/
    // const dbqueryWithConnection = curry(dbquery,connection);
    // dbqueryWithConnection(sql)

  $scope.autoExpand = function(e) {

        var element = typeof e === 'object' ? e.target : document.getElementById(e);
        var scrollHeight = element.scrollHeight; // replace 60 by the sum of padding-top and padding-bottom
        element.style.height = scrollHeight + "px";
        var h_where = Number(element.name.slice(0, 4));
        var version = element.name.slice(4, 15);
        var query = "UPDATE '" + version + "' SET h_text = '" + element.value + "' WHERE h_where = " + h_where + " AND h_format = 7 AND h_id = " + element.id + "";
        $cordovaSQLite.execute(db, query).then(function(res) {});
  };
  $scope.Bible = function(passage, version, P_title) {
        setTimeout(function() {
            var query_user = "SELECT * FROM user_db WHERE username = 'Bill' ";
            $cordovaSQLite.execute(db, query_user).then(function(res) {
                $('.nav_bar_color').removeClass(res.rows.item(0).bar_color_mode);
                $('.nav_bar_color').addClass(res.rows.item(0).bar_color_mode);
                $('.bible_content').css({
                    fontSize: res.rows.item(0).font_size + 'px',
                    fontFamily: res.rows.item(0).font_type
                });
            });
        }, 100);
        Bible_var = Bible_api.filter(passage, version);
        var server_passage = [];
        var query;
        server_passage = Bible_var;
        book_name = server_passage[0];
        chapter_nr = Number(server_passage[1].slice(1, 4));
        $scope.P_title = P_title;
        if (version === "kjv") {
            if (server_passage.length === 2) {
                query = "SELECT * FROM bible_kjv WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' ORDER BY verse_nr";
                $cordovaSQLite.execute(db, query).then(function(res) {
                    var verse = [];
                    for (i = 0; i < res.rows.length; i++) {
                        verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                    }
                    $scope.bible_verse = verse;
                    $scope.modal.show();
                }, function(err) {
                    alert(err);
                });
            } else if (server_passage.length === 3) {
                verse_nr1 = Number(server_passage[2].slice(0, 2));
                verse_nr2 = Number(server_passage[2].slice(2, 5));
                if (server_passage[2].indexOf("S") === 0) {
                    //只有一節
                    query = "SELECT * FROM bible_kjv WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr = " + Number(server_passage[2].slice(1, 4)) + " ORDER BY verse_nr";
                    $cordovaSQLite.execute(db, query).then(function(res) {
                        var verse = [];
                        for (i = 0; i < res.rows.length; i++) {
                            verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                        }
                        $scope.bible_verse = verse;
                        $scope.modal.show();
                    }, function(err) {
                        console.log(err);
                    });
                } else {
                    if (Number(server_passage[2]) > 100000) {
                        verse_nr1 = Number(server_passage[2].slice(0, 3));
                        verse_nr2 = Number(server_passage[2].slice(3, 6));
                        query = "SELECT * FROM bible_kjv WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr >= " + verse_nr1 + " AND verse_nr <= " + verse_nr2 + " ORDER BY verse_nr";
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            var verse = [];
                            for (i = 0; i < res.rows.length; i++) {
                                verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                            }
                            $scope.bible_verse = verse;
                            $scope.modal.show();
                        }, function(err) {
                            console.log(err);
                        });
                    } else if (Number(server_passage[2]) > 1000) {
                        query = "SELECT * FROM bible_kjv WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr >= " + verse_nr1 + " AND verse_nr <= " + verse_nr2 + " ORDER BY verse_nr";
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            var verse = [];
                            for (i = 0; i < res.rows.length; i++) {
                                verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                            }
                            $scope.bible_verse = verse;
                            $scope.modal.show();
                        }, function(err) {
                            console.log(err);
                        });
                    } else if (Number(server_passage[2]) > 100) {
                        query = "SELECT * FROM bible_kjv WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr >= " + Number(server_passage[2].slice(0, 1)) + " AND verse_nr <= " + Number(server_passage[2].slice(1, 3)) + " ORDER BY verse_nr";
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            var verse = [];
                            for (i = 0; i < res.rows.length; i++) {
                                verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                            }
                            $scope.bible_verse = verse;
                            $scope.modal.show();
                        }, function(err) {
                            console.log(err);
                        });
                    } else if (Number(server_passage[2]) < 100) {
                        query = "SELECT * FROM bible_kjv WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr >= " + Number(server_passage[2].slice(0, 1)) + " AND verse_nr <= " + Number(server_passage[2].slice(1, 2)) + " ORDER BY verse_nr";
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            var verse = [];
                            for (i = 0; i < res.rows.length; i++) {
                                verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                            }
                            $scope.bible_verse = verse;
                            $scope.modal.show();
                        }, function(err) {
                            console.log(err);
                        });
                    }
                }
            }
        } else if (version === "cht") {
            if (server_passage.length === 2) {
                query = "SELECT * FROM bible_cht WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' ORDER BY verse_nr";
                $cordovaSQLite.execute(db, query).then(function(res) {
                    var verse = [];
                    for (i = 0; i < res.rows.length; i++) {
                        verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                    }
                    $scope.bible_verse = verse;
                    $scope.modal.show();
                }, function(err) {
                    alert(err);
                });
            } else if (server_passage.length === 3) {
                verse_nr1 = Number(server_passage[2].slice(0, 2));
                verse_nr2 = Number(server_passage[2].slice(2, 5));
                if (server_passage[2].indexOf("S") === 0) {
                    //只有一節
                    query = "SELECT * FROM bible_cht WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr = " + Number(server_passage[2].slice(1, 4)) + " ORDER BY verse_nr";
                    $cordovaSQLite.execute(db, query).then(function(res) {
                        var verse = [];
                        for (i = 0; i < res.rows.length; i++) {
                            verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                        }
                        $scope.bible_verse = verse;
                        $scope.modal.show();
                    }, function(err) {
                        console.log(err);
                    });
                } else {
                    if (Number(server_passage[2]) > 100000) {
                        verse_nr1 = Number(server_passage[2].slice(0, 3));
                        verse_nr2 = Number(server_passage[2].slice(3, 6));
                        query = "SELECT * FROM bible_cht WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr >= " + verse_nr1 + " AND verse_nr <= " + verse_nr2 + " ORDER BY verse_nr";
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            var verse = [];
                            for (i = 0; i < res.rows.length; i++) {
                                verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                            }
                            $scope.bible_verse = verse;
                            $scope.modal.show();
                        }, function(err) {
                            console.log(err);
                        });
                    } else if (Number(server_passage[2]) > 1000) {
                        query = "SELECT * FROM bible_cht WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr >= " + verse_nr1 + " AND verse_nr <= " + verse_nr2 + " ORDER BY verse_nr";
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            var verse = [];
                            for (i = 0; i < res.rows.length; i++) {
                                verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                            }
                            $scope.bible_verse = verse;
                            $scope.modal.show();
                        }, function(err) {
                            console.log(err);
                        });
                    } else if (Number(server_passage[2]) > 100) {
                        query = "SELECT * FROM bible_cht WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr >= " + Number(server_passage[2].slice(0, 1)) + " AND verse_nr <= " + Number(server_passage[2].slice(1, 3)) + " ORDER BY verse_nr";
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            var verse = [];
                            for (i = 0; i < res.rows.length; i++) {
                                verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                            }
                            $scope.bible_verse = verse;
                            $scope.modal.show();
                        }, function(err) {
                            console.log(err);
                        });
                    } else if (Number(server_passage[2]) < 100) {
                        query = "SELECT * FROM bible_cht WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr >= " + Number(server_passage[2].slice(0, 1)) + " AND verse_nr <= " + Number(server_passage[2].slice(1, 2)) + " ORDER BY verse_nr";
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            var verse = [];
                            for (i = 0; i < res.rows.length; i++) {
                                verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                            }
                            $scope.bible_verse = verse;
                            $scope.modal.show();
                        }, function(err) {
                            console.log(err);
                        });
                    }
                }
            }
        } else if (version === "chs") {
            if (server_passage.length === 2) {
                query = "SELECT * FROM bible_chs WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' ORDER BY verse_nr";
                $cordovaSQLite.execute(db, query).then(function(res) {
                    var verse = [];
                    for (i = 0; i < res.rows.length; i++) {
                        verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                    }
                    $scope.bible_verse = verse;
                    $scope.modal.show();
                }, function(err) {
                    alert(err);
                });
            } else if (server_passage.length === 3) {
                verse_nr1 = Number(server_passage[2].slice(0, 2));
                verse_nr2 = Number(server_passage[2].slice(2, 4));
                if (server_passage[2].indexOf("S") === 0) {
                    //只有一節
                    query = "SELECT * FROM bible_chs WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr = " + Number(server_passage[2].slice(1, 3)) + " ORDER BY verse_nr";
                    $cordovaSQLite.execute(db, query).then(function(res) {
                        var verse = [];
                        for (i = 0; i < res.rows.length; i++) {
                            verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                        }
                        $scope.bible_verse = verse;
                        $scope.modal.show();
                    }, function(err) {
                        console.log(err);
                    });
                } else {
                    if (Number(server_passage[2]) > 1000) {
                        query = "SELECT * FROM bible_chs WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr >= " + verse_nr1 + " AND verse_nr <= " + verse_nr2 + " ORDER BY verse_nr";
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            var verse = [];
                            for (i = 0; i < res.rows.length; i++) {
                                verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                            }
                            $scope.bible_verse = verse;
                            $scope.modal.show();
                        }, function(err) {
                            console.log(err);
                        });
                    } else if (Number(server_passage[2]) > 100) {
                        query = "SELECT * FROM bible_chs WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr >= " + Number(server_passage[2].slice(0, 1)) + " AND verse_nr <= " + Number(server_passage[2].slice(1, 3)) + " ORDER BY verse_nr";
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            var verse = [];
                            for (i = 0; i < res.rows.length; i++) {
                                verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                            }
                            $scope.bible_verse = verse;
                            $scope.modal.show();
                        }, function(err) {
                            console.log(err);
                        });
                    } else if (Number(server_passage[2]) < 100) {
                        query = "SELECT * FROM bible_chs WHERE book_name = '" + book_name + "' AND chapter_nr ='" + chapter_nr + "' AND verse_nr >= " + Number(server_passage[2].slice(0, 1)) + " AND verse_nr <= " + Number(server_passage[2].slice(1, 2)) + " ORDER BY verse_nr";
                        $cordovaSQLite.execute(db, query).then(function(res) {
                            var verse = [];
                            for (i = 0; i < res.rows.length; i++) {
                                verse.push(res.rows.item(i).verse_nr + ' ' + res.rows.item(i).verse);
                            }
                            $scope.bible_verse = verse;
                            $scope.modal.show();
                        }, function(err) {
                            console.log(err);
                        });
                    }
                }
            }
        }
    };
    $scope.font = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        LessonContent();
    });
    $ionicModal.fromTemplateUrl('templates/my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
});
