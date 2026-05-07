export function setupBackgroundLegacy() {
    if (!window.$) return;

    window.$("[data-bg-color]:not([data-bg-managed='vanilla']):not([data-bg-managed='vanilla-separate']), [data-bg-image]:not([data-bg-managed='vanilla']):not([data-bg-managed='vanilla-separate']), [data-bg-particles]").each(function () {
        const $this = window.$(this);

        if ($this.hasClass("ts-separate-bg-element")) {
            $this.append('<div class="ts-background">');
            $this.find(".ts-background").css("background-color", $this.attr("data-bg-color"));

            if ($this.attr("data-bg-image") !== undefined) {
                $this.find(".ts-background").append('<div class="ts-background-image">');
                $this.find(".ts-background-image").css("background-image", "url(" + $this.attr("data-bg-image") + ")");
                $this.find(".ts-background-image").css("background-size", $this.attr("data-bg-size"));
                $this.find(".ts-background-image").css("background-position", $this.attr("data-bg-position"));
                $this.find(".ts-background-image").css("opacity", $this.attr("data-bg-image-opacity"));
                $this.find(".ts-background-image").css("background-size", $this.attr("data-bg-size"));
                $this.find(".ts-background-image").css("background-repeat", $this.attr("data-bg-repeat"));
                $this.find(".ts-background-image").css("background-position", $this.attr("data-bg-position"));
                $this.find(".ts-background-image").css("background-blend-mode", $this.attr("data-bg-blend-mode"));
            }

            if ($this.attr("data-bg-parallax") !== undefined) {
                $this.find(".ts-background-image").addClass("ts-parallax-element");
            }
        } else {
            if ($this.attr("data-bg-color") !== undefined) {
                $this.css("background-color", $this.attr("data-bg-color"));
                if ($this.hasClass("btn")) {
                    $this.css("border-color", $this.attr("data-bg-color"));
                }
            }

            if ($this.attr("data-bg-image") !== undefined) {
                $this.css("background-image", "url(" + $this.attr("data-bg-image") + ")");
                $this.css("background-size", $this.attr("data-bg-size"));
                $this.css("background-repeat", $this.attr("data-bg-repeat"));
                $this.css("background-position", $this.attr("data-bg-position"));
                $this.css("background-blend-mode", $this.attr("data-bg-blend-mode"));
            }
        }
    });

    window.$("[data-bg-parallax='scroll']").each(function () {
        const speed = window.$(this).attr("data-bg-parallax-speed");
        const $this = window.$(this);
        let isVisible;

        $this.isInViewport(function (status) {
            if (status === "entered") {
                isVisible = 1;
                let position;

                window.$(window).scroll(function () {
                    if (isVisible === 1) {
                        position = window.$(window).scrollTop() - $this.offset().top;
                        if ($this.find(".ts-parallax-element").hasClass("ts-background-image")) {
                            $this.find(".ts-background-image.ts-parallax-element").css("background-position-y", (position / speed) + "px");
                        } else {
                            $this.find(".ts-parallax-element").css("transform", "translateY(" + (position / speed) + "px)");
                        }
                    }
                });
            }
            if (status === "leaved") {
                isVisible = 0;
            }
        });
    });
}
