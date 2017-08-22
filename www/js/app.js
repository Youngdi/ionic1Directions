var db = null;
angular.module('app', ['ionic', 'ngCordova', 'ionicApp.controllers', 'ionicApp.services'])

.run(function($cordovaDevice, $ionicLoading, $ionicPlatform, $cordovaSQLite, $http, $cordovaFile, $q, SQL) {
        $ionicPlatform.ready(function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
                //會造成SQLite無法使用
                //StatusBar.style(1); 
            }
            // if (window.cordova) {
            //     db = $cordovaSQLite.openDB("directions.db"); // 行動平台語法
            // } else {
            //     db = window.openDatabase('directions.db', "1.0", "Note app", -1);
            // }
            // $cordovaSQLite.deleteDB("directions.db");
            // var platform = $cordovaDevice.getPlatform();
            // if ($cordovaDevice.getPlatform() === "Android") {
            //     Android_db_setting();
            // } else {
            //     dbcopy();
            // }

            // function Android_db_setting() {
            //     $cordovaFile.removeFile(cordova.file.externalDataDirectory, "directions.db")
            //         .then(function(success) {
            //             // success
            //             // alert('移除成功，有先移除sdcard中的directions.db');
            //         }, function(error) {
            //             // alert('移除失敗，有先移除sdcard中的directions.db');
            //         });
            //     $cordovaFile.copyFile(cordova.file.applicationDirectory + 'www/', "directions.db", cordova.file.applicationStorageDirectory + 'databases/', "directions.db")
            //         .then(function(success) {
            //             // alert("複製www中的directions.db到sdcard中成功");
            //         }, function(error) {
            //             // alert("複製www中的directions.db到sdcard中失敗");
            //         });
            //     $cordovaFile.copyFile(cordova.file.applicationStorageDirectory + 'databases/', "directions.db", cordova.file.externalDataDirectory, "directions.db")
            //         .then(function(success) {
            //             // alert("複製www中的directions.db到sdcard中成功");
            //         }, function(error) {
            //             // alert("複製www中的directions.db到sdcard中失敗");
            //         });

            //     $cordovaFile.checkFile(cordova.file.externalDataDirectory, "directions.db")
            //         .then(function() {
            //             // alert("在sdcard中有directions.db");
            //             //在sdcard中有directions.db的話
            //             $cordovaFile.removeFile(cordova.file.applicationStorageDirectory + 'databases/', "directions.db")
            //                 .then(function(success) {
            //                     // success
            //                     // alert('移除成功，有先移除/database中的directions.db');
            //                 }, function(error) {
            //                     // alert('移除失敗，有先移除/database中的directions.db');
            //                 });
            //             // setTimeout(function() {
            //             $cordovaFile.copyFile(cordova.file.externalDataDirectory, "directions.db", cordova.file.applicationStorageDirectory + 'databases/', "directions.db")
            //                 .then(function(success) {
            //                     // alert("複製sdcard中的directions.db到/database中成功");
            //                 }, function(error) {
            //                     // alert("複製sdcard中的directions.db到/database中失敗");
            //                 });
            //             // }, 1000);
            //         }, function() {
            //             //在sdcard中沒有directions.db的話
            //             // alert("在sdcard中沒有directions.db");
            //             // $cordovaFile.removeFile(cordova.file.applicationStorageDirectory + 'databases/', "directions.db")
            //             //     .then(function(success) {
            //             //         // success
            //             //         // alert('移除成功，有先移除/database中的directions.db');
            //             //     }, function(error) {
            //             //         // alert('移除失敗，有先移除/database中的directions.db');
            //             //     });
            //             // setTimeout(function() {
            //             $cordovaFile.copyFile(cordova.file.applicationDirectory + 'www/', "directions.db", cordova.file.externalDataDirectory, "directions.db")
            //                 .then(function(success) {
            //                     // alert("複製www中的directions.db到sdcard中成功");
            //                 }, function(error) {
            //                     // alert("複製www中的directions.db到sdcard中失敗");
            //                 });
            //             $cordovaFile.copyFile(cordova.file.applicationDirectory + 'www/', "directions.db", cordova.file.applicationStorageDirectory + 'databases/', "directions.db")
            //                 .then(function(success) {
            //                     // alert("複製www中的directions.db到/database中成功");
            //                 }, function(error) {
            //                     // alert("複製www中的directions.db到/database中失敗");
            //                 });
            //             // }, 1000);
            //         });
            //     setTimeout(function() {
            //         dbcopy();
            //     }, 2000);
            // }

            dbcopy();
            function dbcopy() {
                if ($cordovaDevice.getPlatform() === "Android") {
                    window.plugins.sqlDB.copy("directions.db", 0, copysuccess, copyerror);
                } else {
                    // //location = 2, will copy the database to /Library/LocalDatabase folder (Disable iCloud Backup)
                    window.plugins.sqlDB.copy("directions.db", 1, copysuccess, copyerror);
                }
                //location = 0, will copy the db to default SQLite Database Directory
                //location = 1, will copy the database to /Library folder
                //location = 2, will copy the database to /Library/LocalDatabase folder (Disable iCloud Backup)
            }
            function copysuccess() {
                //open db and run your queries
                if ($cordovaDevice.getPlatform() === "Android") {
                    db = window.sqlitePlugin.openDatabase({ name: "directions.db" });
                } else {
                    db = window.sqlitePlugin.openDatabase({ name: "directions.db", location: 1 });
                }
            }

            function copyerror(e) {
                //db already exists or problem in copying the db file. Check the Log.
                if ($cordovaDevice.getPlatform() === "Android") {
                    db = window.sqlitePlugin.openDatabase({ name: "directions.db", location: 0 });
                } else {
                    db = window.sqlitePlugin.openDatabase({ name: "directions.db", location: 1 });
                } //e.code = 516 => if db exists
            }
            // initDB();
            // function initDB() {
            //     var save_location = "";
            //     if ($cordovaDevice.getPlatform() === "Android") {
            //         save_location = cordova.file.applicationStorageDirectory + 'databases/';
            //     } else {
            //         save_location = cordova.file.documentsDirectory;
            //     }
            //     $cordovaFile.checkFile(save_location, "directions.db")
            //         .then(function() {
            //             console.log("has db");
            //             db = $cordovaSQLite.openDB("directions.db");
            //             $ionicLoading.hide();
            //         }, function() {
            //             console.log("No db");
            //             db = $cordovaSQLite.openDB("directions.db");
            //             $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS article_chs (h_id INTEGER, h_text text, h_where INTEGER, h_go INTEGER, h_format INTEGER, h_key text, h_desc text)");
            //             $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS article_cht (h_id INTEGER, h_text text, h_where INTEGER, h_go INTEGER, h_format INTEGER, h_key text, h_desc text)");
            //             $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS article_en (h_id INTEGER, h_text text, h_where INTEGER, h_go INTEGER, h_format INTEGER, h_key text, h_desc text)");
            //             $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS bible_cht (id text, book_name text, book_nr text, book_ref text, chapter_nr INTEGER, verse text, verse_nr INTEGER, version text)");
            //             $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS bible_chs (id text, book_name text, book_nr text, book_ref text, chapter_nr INTEGER, verse text, verse_nr INTEGER, version text)");
            //             $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS bible_kjv (id text, book_name text, book_nr text, book_ref text, chapter_nr INTEGER, verse text, verse_nr INTEGER, version text)");
            //             $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user_db (id text, username text, last_page text, lang text, font_type text, bar_color_mode text, tabs_color_mode text, color_hex text, color_ionic text, font_size INTEGER)");
            //             setTimeout(function() {
            //                 var query_user = "INSERT INTO user_db (id, username, last_page, lang, font_type, bar_color_mode, tabs_color_mode, color_ionic ,color_hex, font_size) VALUES ('0','Bill','default','en','Avenir','bar-balanced','tabs-balanced','balanced','#249F88',16)";
            //                 $cordovaSQLite.execute(db, query_user).then(function(res) {}, function(err) {
            //                     console.error(err);
            //                 });
            //                 $http.get('http://54.174.7.155:8088/article_cht')
            //                     .success(function(data, status, headers, config) {
            //                         var query = "INSERT INTO article_cht (h_id , h_text , h_where, h_go, h_format, h_key, h_desc) VALUES";
            //                         var value = "";
            //                         $.each(data, function(i, item) {
            //                             value = value + "(" + item.h_id + ",\"" + item.h_text + "\"," + item.h_where + "," + item.h_go + "," + item.format + ",\"" + item.h_key + "\",\"" + item.h_desc + "\"),";
            //                         });
            //                         var final_value = value.substring(0, value.length - 1);
            //                         // console.log(final_value);
            //                         query = query + final_value;
            //                         $cordovaSQLite.execute(db, query).then(function(res) {
            //                             console.log("INSERT ID cht-> " + res.insertId);
            //                             // $ionicLoading.hide();
            //                         }, function(err) {
            //                             console.error(err);
            //                         });
            //                     })
            //                     .error(function(err, status, headers, config) {
            //                         console.error(err);
            //                     });
            //                 $http.get('http://54.174.7.155:8088/article_chs')
            //                     .success(function(data, status, headers, config) {
            //                         var query = "INSERT INTO article_chs (h_id , h_text , h_where, h_go, h_format, h_key, h_desc) VALUES";
            //                         var value = "";
            //                         $.each(data, function(i, item) {
            //                             value = value + "(" + item.h_id + ",\"" + item.h_text + "\"," + item.h_where + "," + item.h_go + "," + item.format + ",\"" + item.h_key + "\",\"" + item.h_desc + "\"),";
            //                         });
            //                         var final_value = value.substring(0, value.length - 1);
            //                         // console.log(final_value);
            //                         query = query + final_value;
            //                         $cordovaSQLite.execute(db, query).then(function(res) {
            //                             console.log("INSERT ID cht-> " + res.insertId);
            //                             // $ionicLoading.hide();
            //                         }, function(err) {
            //                             console.error(err);
            //                         });
            //                     })
            //                     .error(function(err, status, headers, config) {
            //                         console.error(err);
            //                     });
            //                 $http.get('http://54.174.7.155:8088/article_en')
            //                     .success(function(data, status, headers, config) {
            //                         var query = "INSERT INTO article_en (h_id , h_text , h_where, h_go, h_format, h_key, h_desc) VALUES";
            //                         var value = "";
            //                         $.each(data, function(i, item) {
            //                             value = value + "(" + item.h_id + ",\"" + item.h_text + "\"," + item.h_where + "," + item.h_go + "," + item.format + ",\"" + item.h_key + "\",\"" + item.h_desc + "\"),";
            //                         });
            //                         var final_value = value.substring(0, value.length - 1);
            //                         // console.log(final_value);
            //                         query = query + final_value;
            //                         $cordovaSQLite.execute(db, query).then(function(res) {
            //                             console.log("INSERT ID en-> " + res.insertId);
            //                             // $ionicLoading.hide();

            //                         }, function(err) {
            //                             console.error(err);
            //                         });
            //                     })
            //                     .error(function(err, status, headers, config) {
            //                         console.error(err);
            //                     });
            //                 $http.get('http://54.174.7.155:8086/bible_cht')
            //                     .success(function(data, status, headers, config) {
            //                         var query = "INSERT INTO bible_cht (id, book_name, book_nr , book_ref , chapter_nr , verse , verse_nr , version) VALUES";
            //                         var value = "";
            //                         $.each(data, function(i, item) {
            //                             value = value + "('" + item._id + "','" + item.book_name + "'," + item.book_nr + ",'" + item.book_ref + "'," + item.chapter_nr + ",'" + item.verse + "'," + item.verse_nr + ",'" + item.version + "'),";
            //                         });
            //                         var final_value = value.substring(0, value.length - 1);
            //                         query = query + final_value;
            //                         $cordovaSQLite.execute(db, query).then(function(res) {
            //                             console.log("INSERT ID Bible_cht-> " + res.insertId);
            //                         }, function(err) {
            //                             console.error(err);
            //                         });
            //                     })
            //                     .error(function(err, status, headers, config) {
            //                         console.error(err);
            //                     });
            //                 $http.get('http://54.174.7.155:8088/bible_chs')
            //                     .success(function(data, status, headers, config) {
            //                         var query = "INSERT INTO bible_chs (id, book_name, book_nr , book_ref , chapter_nr , verse , verse_nr , version) VALUES";
            //                         var value = "";
            //                         $.each(data, function(i, item) {
            //                             value = value + "('" + item._id + "','" + item.book_name + "'," + item.book_nr + ",'" + item.book_ref + "'," + item.chapter_nr + ",'" + item.verse + "'," + item.verse_nr + ",'" + item.version + "'),";
            //                         });
            //                         var final_value = value.substring(0, value.length - 1);
            //                         query = query + final_value;
            //                         $cordovaSQLite.execute(db, query).then(function(res) {
            //                             console.log("INSERT ID Bible_chs-> " + res.insertId);
            //                         }, function(err) {
            //                             console.error(err);
            //                         });
            //                     })
            //                     .error(function(err, status, headers, config) {
            //                         console.error(err);
            //                     });
            //                 $http.get('http://54.174.7.155:8086/bible_kjv')
            //                     .success(function(data, status, headers, config) {
            //                         var query = "INSERT INTO bible_kjv (id, book_name, book_nr , book_ref , chapter_nr , verse , verse_nr , version) VALUES";
            //                         var value = "";
            //                         $.each(data, function(i, item) {
            //                             value = value + "('" + item._id + "','" + item.book_name + "'," + item.book_nr + ",'" + item.book_ref + "'," + item.chapter_nr + ",\"" + item.verse + "\"," + item.verse_nr + ",'" + item.version + "'),";
            //                         });
            //                         var final_value = value.substring(0, value.length - 1);
            //                         query = query + final_value;
            //                         $cordovaSQLite.execute(db, query).then(function(res) {
            //                             console.log("INSERT ID Bible_kjv-> " + res.insertId);
            //                         }, function(err) {
            //                             console.error(err);
            //                         });
            //                     })
            //                     .error(function(err, status, headers, config) {
            //                         console.error(err);
            //                     });
            //             }, 100);
            //         });
            // }
        });
    })
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.backButton.previousTitleText(false).text('');
        $ionicConfigProvider.navBar.alignTitle('center');
        // If none of the above states are matched, use this as the fallback:
        $urlRouterProvider.otherwise('/tab/home');
        // Set up an abstract state for the tabs directive.
        $stateProvider.state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })

        // Each tab has its own nav history stack:
        .state('tab.home', {
            url: '/home',
            views: {
                'tab-home': {
                    templateUrl: 'templates/tab-home.html',
                    controller: 'HomeCtrl'
                }
            }
        })

        .state('tab.homeLesson', {
            url: '/lesson/:h_go',
            views: {
                'tab-home': {
                    templateUrl: 'templates/tab-homeLesson.html',
                    controller: 'LessonCtrl'
                }
            }
        })

        .state('tab.LessonContent', {
            url: '/lessonContent/:h_go',
            views: {
                'tab-home': {
                    templateUrl: 'templates/tab-LessonContent.html',
                    controller: 'LessonContentCtrl'
                }
            }
        })

        .state('tab.more', {
            url: '/more',
            views: {
                'tab-more': {
                    templateUrl: 'templates/tab-more.html',
                    controller: 'MoreCtrl'
                }
            }
        })

        .state('tab.moreDetail', {
            url: '/moreDetail/:h_go/:h_text',
            views: {
                'tab-more': {
                    templateUrl: 'templates/tab-more-details.html',
                    controller: 'MoreDetailsCtrl'
                }
            }
        })

        .state('tab.setting', {
            url: '/setting',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/tab-setting.html',
                    controller: 'SettingCtrl'
                }
            }
        })

        .state('tab.setting_lang', {
            url: '/setting_lang',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/tab-setting_lang.html',
                    controller: 'SettingCtrl'
                }
            }
        })

        .state('tab.setting_color', {
            url: '/setting_color',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/tab-setting_color.html',
                    controller: 'SettingCtrl'
                }
            }
        })

        .state('tab.setting_font_type', {
            url: '/setting_font_type',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/tab-setting_font_type.html',
                    controller: 'SettingCtrl'
                }
            }
        })

        .state('tab.setting_font_size', {
            url: '/setting_font_size',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/tab-setting_font_size.html',
                    controller: 'SettingCtrl'
                }
            }
        });
    });
