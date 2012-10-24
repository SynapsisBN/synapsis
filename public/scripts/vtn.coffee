(($) ->

    $ ->
        paper  = Raphael("holder", 640, 400)
        n      = 10
        points = []
        center = x: 320, y: 200
        radius = 100

        for i in [0..n]
            x = center.x + radius * Math.cos(2 * Math.PI * i / n)
            y = center.y + radius * Math.sin(2 * Math.PI * i / n)

            paper.rect(x, y, 25, 25, 10).click () ->

) jQuery
