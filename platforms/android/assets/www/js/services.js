angular.module('ionicApp.services', [])

.factory('SQL', function($q, $cordovaSQLite) {
    return {
        insert: function(query, item) {
            {
                // Set up the $q deferred object.
                var deferred = $q.defer();

                db.transaction(function(transaction) {
                    transaction.executeSql(query, [item._id, item.b_phase, item.h_id, item.h_text, item.h_where, item.info], function(transaction, result) {
                        // do whatever you need to do to the result
                        var results = parseDataFrom(result);
                        // resolve the promise with the results
                        deferred.resolve(results);
                    }, nullHandler, errorHandler);
                });
                //    Return the deferred's promise.
                return deferred.promise;
            }
        },
        search: function(query) {
            console.log("search");
            $cordovaSQLite.execute(db, query).then(function(res) {
                return (res.rows);
            }, function(err) {
                alert(err);
            });
        },
        delete: function() {
            // Set up the $q deferred object.
            var deferred = $q.defer();

            db.transaction(function(transaction) {
                transaction.executeSql(query, [item._id, item.b_phase, item.h_id, item.h_text, item.h_where, item.info], function(transaction, result) {
                    // do whatever you need to do to the result
                    var results = parseDataFrom(result);
                    // resolve the promise with the results
                    deferred.resolve(results);
                }, nullHandler, errorHandler);
            });
            // Return the deferred's promise.
            return deferred.promise;
        },
        updata: function() {
            // Set up the $q deferred object.
            var deferred = $q.defer();

            db.transaction(function(transaction) {
                transaction.executeSql(query, [item._id, item.b_phase, item.h_id, item.h_text, item.h_where, item.info], function(transaction, result) {
                    // do whatever you need to do to the result
                    var results = parseDataFrom(result);
                    // resolve the promise with the results
                    deferred.resolve(results);
                }, nullHandler, errorHandler);
            });
            // Return the deferred's promise.
            return deferred.promise;
        }
    };
})

.factory('Bible_api', function() {
    return {
        filter: function(passage, version) {
            var search_array = [];
            var Book, Chapter, Verse1, Verse2;
            if (passage.indexOf(" ") === -1) {
                //直接傳str收回整個Bible
                search_array.push(passage);
                return search_array;
            } else {
                if (passage.indexOf(":") === -1) {
                    //Ex: John 3 ==>收回整個書本的章節
                    Book = passage.split(" ")[0];
                    Chapter = passage.split(" ")[1];
                    search_array.push(Book);
                    search_array.push('C' + Chapter);
                    return search_array;
                } else {
                    if (passage.indexOf("-") === -1) {
                        //Ex: John 3:16 只傳回一節
                        Book = passage.split(" ")[0];
                        Chapter = passage.split(" ")[1].split(":")[0];
                        Verse1 = passage.split(" ")[1].split(":")[1].split("-")[0];
                        search_array.push(Book);
                        search_array.push('C' + Chapter);
                        search_array.push('S' + Verse1);
                        return search_array;
                    } else {
                        if (passage.indexOf(",") === -1) {
                            //Ex: John 3:16-17
                            Book = passage.split(" ")[0];
                            Chapter = passage.split(" ")[1].split(":")[0];
                            Verse1 = passage.split(" ")[1].split(":")[1].split("-")[0];
                            Verse2 = passage.split(" ")[1].split(":")[1].split("-")[1];
                            search_array.push(Book);
                            search_array.push('C' + Chapter);
                            search_array.push(Verse1 + Verse2);
                            return search_array;
                        } else {
                            Book = passage.split(" ")[0];
                            Chapter = passage.split(" ")[1].split(":")[0];
                            Verse1 = passage.split(" ")[1].split(":")[1].split("-")[0];
                            Verse2 = passage.split(" ")[1].split(":")[1].split("-")[1].split(",")[0];
                            console.log('Book:' + Book);
                            console.log('Chapter:' + Chapter);
                            console.log('Verse1:' + Verse1);
                            console.log('Verse2:' + Verse2);
                            search_array.push(Book);
                            search_array.push('C' + Chapter);
                            search_array.push(Verse1 + Verse2);
                            //Ex: John 3:16-17,20 記得要送一個旗標給伺服器說要搜尋跨章節的
                            for (i = 1; i < passage.split(",").length; i++) {
                                if (passage.split(",")[i].indexOf("-") === -1) {
                                    single_verse = passage.split(",")[i];
                                    console.log(passage.split(",")[i]);
                                    search_array.push(single_verse);
                                } else {
                                    pair1_verse = passage.split(",")[i].split("-")[0];
                                    pair2_verse = passage.split(",")[i].split("-")[1];
                                    console.log(passage.split(",")[i].split("-")[0]);
                                    console.log(passage.split(",")[i].split("-")[1]);
                                    search_array.push(pair1_verse + pair2_verse);

                                }
                            }
                            return search_array;
                        }
                    }
                }
            }
        },
        transfer_number: function(h_go) {
            var chinese_lesson_name = "";
            switch (h_go) {
                case "01":
                    chinese_lesson_name = "一";
                    break;
                case "02":
                    chinese_lesson_name = "二";
                    break;
                case "03":
                    chinese_lesson_name = "三";
                    break;
                case "04":
                    chinese_lesson_name = "四";
                    break;
                case "05":
                    chinese_lesson_name = "五";
                    break;
                case "06":
                    chinese_lesson_name = "六";
                    break;
                case "07":
                    chinese_lesson_name = "七";
                    break;
                case "08":
                    chinese_lesson_name = "八";
                    break;
                case "09":
                    chinese_lesson_name = "九";
                    break;
                case "10":
                    chinese_lesson_name = "十";
                    break;
                case "11":
                    chinese_lesson_name = "十一";
                    break;
                case "12":
                    chinese_lesson_name = "十二";
                    break;
                case "13":
                    chinese_lesson_name = "十三";
                    break;
                case "14":
                    chinese_lesson_name = "十四";
                    break;
                case "15":
                    chinese_lesson_name = "十五";
                    break;
                case "16":
                    chinese_lesson_name = "十六";
                    break;
                case "17":
                    chinese_lesson_name = "十七";
                    break;
                case "18":
                    chinese_lesson_name = "十八";
                    break;
            }
            return chinese_lesson_name;
        },
        get: function(check_font_pop) {

        }
    };
});
