'use strict';

angular.module('dataApiControl').factory('expData',function(){

    return {
        findDataEntries : function(query){
            return exp.findData(query)
                .then(function(items){
                    return items
                });
        },
        saveData : function(group, key, value){
            return exp.getData(group, key)
                .then(function(data){
                    data.value = value;
                    return data.save()
                        .then(function(){
                            return data.refresh();
                        })
                        .then(function(){
                            return data.value;
                        })
                });
        },
        createEntry : function(dataEntry){
            return exp.getData(dataEntry.group, dataEntry.key)
                .then((function(data){
                    if (!data){
                        return exp.createData(dataEntry.group, dataEntry.key, {})
                            .then(function(data){
                                return {group: data.group, key: data.key, value:{}};
                            });
                    }else{
                        return null;
                    }

                }));
        },
        removeEntry : function(dataEntry){
            return exp.deleteData(dataEntry.group, dataEntry.key)
                .then(function(){
                    return {};
                });
        }
    }

});