/* Vending Machine Class */
var VendingMachine = function() {
  this.$filler = $(".fillers")
  this.$selectedSnack = $(".selectedSnack")
  this.$container = $(".snacks")
  this.selectedSnack = null
  this.container = ".snacks"
  this.selector = ".snack"
  this.rowSize = 150
  this.fillers = 30
  this._init()
}

VendingMachine.prototype._init = function() {
  this.snacks = this._buildSnackList([
    "cheetos", "cheetos_flaming", "cheetos_puffs",
    "dorritos", "dorritos_cool", "kitkat",
    "m&ms_almond", "m&ms_peaunt_butter",
    "m&ms_peaunt", "milkyway", "snickers"
  ])
}

VendingMachine.prototype.buildGrid = function() {
  var _this = this;
  this.$container.html("")
  this.$filler.html("")
  this._shuffleSnacks()

  this.snacks.forEach(function(snack) {
    _this.$container.append(snack.element)
  })

  for(var i = 0; i < this.fillers; i++) {
    this.$filler.append(this._buildSnack())
  }

  try {
    this.$container.mason({
      itemSelector: this.selector,
      ratio: 1.5,
      sizes: [
        [1, 1],
        [2, 1]
      ],
      filler: {
        itemSelector: '.filler'
      },
      randomFillers: true,
      layout: 'fluid',
      gutter: 5
    })
  } catch(error) {
    console.log(error)
  }
}

VendingMachine.prototype.start = function() {
  var _this = this
  var count = 0
  var index = 0
  var times = Math.floor((Math.random() * 15) + 5);

  var interval = setInterval(function() {
    if(index >= _this.snacks.length) index = 0

    $(_this.selector).removeClass("selected")
    _this.snacks[index].element.addClass("selected")

    if(count == times) {
      clearInterval(interval)
      _this._selectSnack(_this.snacks[index])
    } else if(count < times) {
      count++
      index++
    }
  }, 180)
}

VendingMachine.prototype.dispense = function() {
  this.selectedSnack.available--
  var message = ""

  if(this.selectedSnack.available == 0) {
    message = "You got the last one!"
  } else {
    message = "Dispensing.... "
    message += this.selectedSnack.available + " more are left."
  }

  this.$selectedSnack.find(".dispense").hide()
  this.$selectedSnack.find(".reset").addClass("full").text("I'm still hungry!")
  this.$selectedSnack.find(".header").html([
    message, " Enjoy the <span>", this.selectedSnack.name, "</span> :)"
  ].join(""))
}

VendingMachine.prototype.reset = function() {
  var _this = this
  this.$selectedSnack.fadeOut(500)
  this.selectedSnack = null

  setTimeout(function() {
    _this.$selectedSnack.find(".image").attr("src", "")
    _this.start()
  }, 600)
}

VendingMachine.prototype._selectSnack = function(snack) {
  var message;
  var _this = this
  var available = snack.available > 0

  this.selectedSnack = snack
  this.$selectedSnack.find(".reset").text("Try Again")

  if(available) {
    message = [
      "CONGRATS! You can be the proud new owner of a some ",
      "<span>", snack.name, "</span> :)"
    ].join("")

    this.$selectedSnack.find(".dispense").show()
    this.$selectedSnack.find(".reset").removeClass("full")
  } else {
    message = [
      "SORRY! We are all sold out of ",
      "<span>", snack.name, "</span> :("
    ].join("")

    this.$selectedSnack.find(".dispense").hide()
    this.$selectedSnack.find(".reset").addClass("full")
  }

  this.$selectedSnack.find(".header").html(message)
  this.$selectedSnack.find(".image").attr("src", snack.imageFit)
  this.$selectedSnack.css({
    background: snack.color
  })

  setTimeout(function() {
    _this.$selectedSnack.fadeIn(500)
  }, 500)
}

VendingMachine.prototype._buildSnack = function(snack) {
  var className = ""
  var element = $("<div/>")

  if(snack) {
    className += "snack active"

    element.css({
      "background-color": snack.color,
      "background-image": "url(" + snack.image + ")",
    })
  } else {
    className += "filler"
  }

  return $("<div/>").append(element).addClass(className)
}

VendingMachine.prototype._buildSnackList = function(list) {
  var snacks = []

  for(var index in list) {
    var name = list[index]
    var snack = {
      name: name.replace(/_/g, " "),
      image: "./images/" + name + ".png",
      imageFit: "./images/" + name + "_fit.png",
      available: Math.floor((Math.random() * 15) + 1),
      color: this._randomColor()
    }

    snack.element = this._buildSnack(snack)
    snacks.push(snack)
  }

  return snacks
}

VendingMachine.prototype._randomColor = function() {
  var random = Math.floor(Math.random() * 360)
  return "hsl(" + random + ", 76%, 52%)"
}

VendingMachine.prototype._shuffleSnacks = function() {
  var currentIndex = this.snacks.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = this.snacks[currentIndex];
    this.snacks[currentIndex] = this.snacks[randomIndex];
    this.snacks[randomIndex] = temporaryValue;
  }
}

/* Start The Vending Machine */
var loading = $(".loading")
var message = $("#hiThere")
var startButton = $(".button.start")
var dispenseButton = $(".button.dispense")
var resetButton = $(".button.reset")
var machine = new VendingMachine()

$(function() {
  message.css("display", "block")

  new Vivus('hiThere', {
    type: 'scenario-sync',
    duration: 20,
    start: 'autostart',
    dashGap: 20,
    forceRender: false
  }, function() {
    startButton.fadeIn(500)
    machine.buildGrid()
  })
})

startButton.click(function() {
  loading.fadeOut(500)

  setTimeout(function() {
    machine.start()
  }, 600)
})

dispenseButton.click(function() {
  machine.dispense()
})

resetButton.click(function() {
  machine.reset()
})

$(window).resize(function() {
  machine.buildGrid()
})
