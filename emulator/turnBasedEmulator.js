angular.module('myApp', [])
.controller('PlatformCtrl',
    ["$sce", "$scope", "$rootScope", "$log", "$window", "emulatorMessageService", "stateService",
      function ($sce, $scope, $rootScope, $log, $window, emulatorMessageService, stateService) {
  'use strict';

  var platformUrl = $window.location.search;
  var gameUrl = platformUrl.length > 1 ? platformUrl.substring(1) : null;
  if (gameUrl === null) {
    gameUrl = "http://yoav-zibin.github.io/emulator/turnBasedExample.html";
    console.log("You should pass the game url like this: ...platform.html?<GAME_URL> , e.g., http://yoav-zibin.github.io/emulator/emulator/turnBasedEmulator.html?http://yoav-zibin.github.io/TicTacToe/game.html");
  }
  $scope.gameUrl = $sce.trustAsResourceUrl(gameUrl);
  var gotGameReady = false;
  $scope.startNewMatch = function () {
    stateService.startNewMatch();
  };
  $scope.getStatus = function () {
    if (!gotGameReady) {
      return "Waiting for 'gameReady' message from the game...";
    }
    var matchState = stateService.getMatchState();
    if (matchState.endMatchScores) {
      return "Match ended with scores: " + matchState.endMatchScores;
    }
    return "Match is ongoing! Turn of player index " + matchState.turnIndex;
  };
  $scope.playMode = "passAndPlay";
  stateService.setPlayMode($scope.playMode);
  $scope.$watch('playMode', function() {
    stateService.setPlayMode($scope.playMode);
  });

  emulatorMessageService.addMessageListener(function (message) {
    if (message.gameReady !== undefined) {
      if (gotGameReady) {
        throw new Error("Got a second gameReady message! Your game must send exactly one gameReady message!");
      }
      gotGameReady = true;
      var game = message.gameReady;
      game.isMoveOk = function (params) {
        emulatorMessageService.sendMessage({isMoveOk: params});
        return true;
      };
      game.updateUI = function (params) {
        emulatorMessageService.sendMessage({updateUI: params});
      };
      stateService.setGame(game);
    } else if (message.isMoveOkResult !== undefined) {
      if (message.isMoveOkResult !== true) {
        $window.alert("isMoveOk returned " + message.isMoveOkResult);
      }
    } else if (message.makeMove !== undefined) {
      stateService.makeMove(message.makeMove);
    } else {
      $window.alert("Platform got: " + angular.toJson(message, true));
    }
  });
}]);
