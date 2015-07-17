angular.module('plunker', ['ui.bootstrap.dropdown']);
function DropdownCtrl($scope,$log) {
    $scope.items = [
        "The first choice!",
        "And another choice for you.",
        "but wait! A third!"
    ];

    $scope.toggled = function(open) {
        var now = new Date();
        $log.info('i was opened...',open,now);
        if (open) {
            $scope.items.push("last opened at " + now);
        }
    };
}