manageMaslulApp.controller('GroupStatusController', ['$scope', 'UsersService', 'GroupsService',
    function ($scope, UsersService, GroupsService) {

        const stages = ["הגעה למדור", "סגל ראשון", "סגל שני", "סגל שלישי", "כניסה לתפקיד"];
        
        let selectedGroup;
        let groupData = {
            groupNames: [],
            series: []
        };

        $scope.groups;
        
        GroupsService.getAll().then((response) => {
             $scope.groups = response.data;
        })

        $scope.getGroupData = function (groupName) {
            selectedGroup = groupName;
            
            UsersService.getGroupAllData(groupName).then((response) =>{

                groupData = {
                    groupNames: [],
                    series: []
                };


                initilizeGroupData(response.data);
                initilizeChart();
            });
        }

        const initilizeChart = function () {
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'group-viewchart',
                    type: 'column'
                },
                title: {
                    text: selectedGroup,
                    useHTML: Highcharts.hasBidiBug
                },
                xAxis: {
                    categories: groupData.groupNames,
                },
                yAxis: {
                    min: 0,
                    max: 60,
                    title: {
                        text: 'כמה משימות סיים',
                        useHTML: Highcharts.hasBidiBug
                    },
                },
                legend: {
                    shadow: true,
                    useHTML: true
                },
                tooltip: {
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: groupData.series
            });
        }

        const initilizeGroupData = function (userData) {
            let userStageData = userData.map((user) => {
                return getUserStageData(user);
            });

            groupData.groupNames = userStageData.map((currUser) => currUser.Name);


            stages.forEach((stageName) => {

                let seriesTemplate = {
                    name: "",
                    data: []
                };

                seriesTemplate.name = stageName;

                userStageData.forEach((user) => {
                    const task = user.stages
                                     .filter((stageData) => stageData.stageName
                                                                     .includes(stageName))[0];
                    if (task === undefined) {
                        seriesTemplate.data.push(0)
                    } else {
                        seriesTemplate.data.push(task.doneTasks)
                    }
                });

                groupData.series.push(seriesTemplate);
            })
        }

        const getUserStageData = function (user) {
            let userStagesData = {
                Name: "",
                stages: []
            };

            let stageCount = 0;

            if (user.stages) {
                user.stages.forEach(stage => {
                    userStagesData.Name = user.firstName + " " + user.lastName;
                    userStagesData.stages.push({
                        stageName: stage.name,
                        doneTasks: getDoneMission(stage.tasks, user.doneTasks, stageCount)
                    });

                    stageCount++;
                });
            }

            return userStagesData;
        }

        const getDoneMission = function (stageMission, doneTasks, keyStage) {
            let missionCount = 0;

            if (doneTasks) {
                stageMission.forEach(currentMission => {
                    if (doneTasks.filter(doneTask => {
                            return ((doneTask.tasktypeid.includes(currentMission.tasktypeid)) && 
                                    (doneTask.stage === keyStage));
                        }).length > 0) {
                        missionCount++;
                    }
                });
            }
            return missionCount;
        }

    }
]);