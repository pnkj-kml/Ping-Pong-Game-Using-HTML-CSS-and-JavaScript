// To store Reference of Elements in variables
let board = document.getElementById("board");
let rod1 = document.getElementById("rod_1");
let rod2 = document.getElementById("rod_2");
let ball = document.getElementById("ball");
let rod1_score = document.getElementById("player1_score");
let rod2_score = document.getElementById("player2_score");
let msg = document.getElementById("message");

let ball_cords, rod1_cords, rod2_cords, board_cords;

//  Variable to check the current game state and Maximum Score alert
let gameState = "start";
let score_alert = "start";

//  To get the Coordinates of Elements used in game
function getCoordinates() {
  board_cords = board.getBoundingClientRect();
  ball_cords = ball.getBoundingClientRect();
  rod1_cords = rod1.getBoundingClientRect();
  rod2_cords = rod2.getBoundingClientRect();
}

// Event Listener for Enter and other keys
document.addEventListener("keydown", (event) => {
  getCoordinates();

  // For Enter Key
  if (event.key === "Enter") {
    if (score_alert === "start") {
      localStorage.setItem("rod_1", 0);
      localStorage.setItem("rod_2", 0);
      window.alert("This is your first time");
    } else if (score_alert === "updated") {
      window.alert(
        "Congratulations !!!!!!!!!!!" +
          "\n" +
          "New Highest Score Recorded..." +
          "\n" +
          "Rod 1 score : " +
          localStorage.getItem("rod_1").toString() +
          "\n" +
          "Rod 2 score : " +
          localStorage.getItem("rod_2")
      );
      score_alert = "same";
    }
    gameState = gameState === "start" ? "play" : "start";
    if (gameState === "play") {
      msg.style.display = "none";
      moveBall();
    }
  }
  // For "A" and "D" keys used to move the Paddles
  if (gameState === "play") {
    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
      rod1.style.left =
        Math.max(board_cords.left + 5, rod1_cords.left - 20) + "px";
      rod2.style.left =
        Math.max(board_cords.left + 5, rod2_cords.left - 20) + "px";
    }
    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
      rod1.style.left =
        Math.min(
          board_cords.right - rod1_cords.width - 5,
          rod1_cords.left + 20
        ) + "px";
      rod2.style.left =
        Math.min(
          board_cords.right - rod2_cords.width - 5,
          rod2_cords.left + 20
        ) + "px";
    }
  }
});

// collision detection function of ball with rod 1 or rod 2
function collision(rod, rod_cords) {
  // Collision with Rod 1
  const a = rod_cords.bottom > ball_cords.top;
  // Collision with Rod 2
  const b = rod_cords.top < ball_cords.bottom;
  //to detect ball touches the rod area
  const c = rod_cords.left < ball_cords.right;
  const d = rod_cords.right > ball_cords.left;
  return a && b && c && d;
}

//  Function to Reset Game Board
function reset(rod) {
  // To Score data in local Storage if new record is made
  if (localStorage.getItem("rod_1").toString() < score_rod1) {
    localStorage.setItem("rod_1", score_rod1);
    localStorage.setItem(
      "rod_2",
      Math.max(score_rod2, localStorage.getItem("rod_2", score_rod2))
    );
    score_alert = "updated";
  } else if (localStorage.getItem("rod_2").toString() < score_rod2) {
    localStorage.setItem(
      "rod_1",
      Math.max(score_rod1, localStorage.getItem("rod_1", score_rod1))
    );
    localStorage.setItem("rod_2", score_rod2);
    score_alert = "updated";
  }

  // Reset the values to initial state
  gameState = "start";
  msg.style.display = "block";
  rod1.style.left = board_cords.right / 2 - rod1_cords.width / 2 + "px";
  rod2.style.left = board_cords.right / 2 - rod1_cords.width / 2 + "px";

  // Position the ball to losing side in next round
  ball.style.left = board_cords.right / 2 - ball_cords.width / 2 + "px";
  if (rod === rod2) {
    ball.style.top = rod1_cords.bottom + "px";
  } else {
    ball.style.top = rod2_cords.top - rod2_cords.height + "px";
  }

  score_rod1 = 0;
  score_rod2 = 0;
  rod1_score.textContent = "0";
  rod2_score.textContent = "0";
}

// Variables for Speed of Ball in x and y dirextion
let velocityX = Math.max(3, Math.random() * 5);
let velocityY = Math.max(3, Math.random() * 5);

// Score variables
let score_rod1 = 0;
let score_rod2 = 0;
let animation, lastCollide;

// Animations Functions to move the Ball
function moveBall() {
  getCoordinates();

  // the ball moes with the velocity
  ball.style.left = ball_cords.left + velocityX + "px";
  ball.style.top = ball_cords.top + velocityY + "px";

  // when the ball collides with right and left walls change the velocity.
  if (ball_cords.right > board_cords.right - 5) {
    velocityX = Math.min(-4, Math.random() * -6);
  } else if (ball_cords.left < board_cords.left + 5) {
    velocityX = Math.max(4, Math.random() * 6);
  }

  // to check weather the ball hit the rod 1 or the rod 2
  let rod = ball_cords.top < board_cords.height / 2 ? rod1 : rod2;
  let rod_cords = rod.getBoundingClientRect();

  // if the ball hits a rod 1 or rod 2
  if (collision(rod, rod_cords)) {
    // check where the ball hits the rod i.e. left/right corner or middle and normalize the value of collidePoint, we need to get numbers between -1 and 1.
    let collidePoint = ball_cords.x - (rod_cords.x + rod_cords.width / 2);
    collidePoint = collidePoint / (rod_cords.width / 2);

    // To make changes in the Direction of Ball when collide with rods
    if (rod === rod2) {
      velocityY = Math.min(-4, Math.random() * -6);
      if (collidePoint < -0.1) {
        velocityX = Math.min(-3, Math.random() * -5);
      } else if (collidePoint > 0.1) {
        velocityX = Math.max(3, Math.random() * 5);
      } else {
        velocityX = 1;
      }

      if (lastCollide !== rod) {
        score_rod2++;
        lastCollide = rod;
      }
      rod2_score.textContent = score_rod2;
    } else {
      velocityY = Math.max(4, Math.random() * 6);
      if (collidePoint < -0.1) {
        velocityX = Math.min(-3, Math.random() * -5);
      } else if (collidePoint > 0.1) {
        velocityX = Math.max(3, Math.random() * 5);
      } else {
        velocityX = 1;
      }

      if (lastCollide !== rod) {
        score_rod1++;
        lastCollide = rod;
      }
      rod1_score.textContent = score_rod1;
    }
  }
  // When ball passes top or bottom walls without collision
  if (ball_cords.top < board_cords.top + 5) {
    cancelAnimationFrame(animation);
    window.alert("Winner !!!!! \n Rod 2 with Score " + score_rod2);
    reset(rod2);
    return;
  } else if (ball_cords.bottom > board_cords.bottom - 5) {
    cancelAnimationFrame(animation);
    window.alert("Winner !!!!! \n Rod 1 with Score " + score_rod1);
    reset(rod1);
    return;
  }

  animation = requestAnimationFrame(() => {
    moveBall();
  });
}
