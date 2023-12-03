const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const gcmq = require("gulp-group-css-media-queries");
const fontfacegen = require("gulp-fontfacegen");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const avif = require("gulp-avif");
const del = require("del");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");
const svgSprite = require("gulp-svg-sprite");
const include = require("gulp-include");

function pages() {
	return src("src/pages/*.html")
		.pipe(
			include({
				includePaths: "src/components",
			})
		)
		.pipe(dest("src"))
		.pipe(browserSync.stream());
}
//Перед использованием удалить файл fontface.css в папке css
function fonts() {
	return src("src/fonts/*.{ttf,otf,eot,otc,svg}")
		.pipe(
			fonter({
				subset: [66, 67, 68, 69, 70, 71],
				formats: ["ttf", "woff"],
			})
		)
		.pipe(src("src/fonts/*.{ttf,otf,eot}"))
		.pipe(ttf2woff2())

		.pipe(src("src/fonts/*.{ttf,woff,woff2}"))
		.pipe(dest("src/font"))
		.pipe(
			fontfacegen({
				filepath: "src/css",
				filename: "fontface.css",
			})
		);
}
function images() {
	return src(["src/img/src/**/*.*", "!src/img/src/**/*.svg", "!src/img/src/**/*.gif"])
		.pipe(newer("src/img"))
		.pipe(avif({ quality: 60 }))

		.pipe(src("src/img/src/**/*.*", "!src/img/src/**/*.svg"))
		.pipe(newer("src/img"))
		.pipe(webp())

		.pipe(src("src/img/src/**/*.*", "!src/img/src/**/*.svg"))
		.pipe(newer("src/img"))
		.pipe(imagemin())

		.pipe(dest("src/img"));
}
function svg() {
	return src("src/img/*.svg")
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: "../sprite.svg",
						example: true,
					},
				},
			})
		)
		.pipe(dest("src/img"));
}

function scripts() {
	return src(["src/js/main.js"])
		.pipe(concat("main.min.js"))
		.pipe(uglify())
		.pipe(dest("src/js"))
		.pipe(browserSync.stream());
}

function styles() {
	return (
		src("src/scss/style.scss")
			.pipe(
				autoprefixer()
			)
			// .pipe(concat("style.min.css"))
			.pipe(
				sass({
					outputStyle: "compressed",
				}).on("error", sass.logError)
			)
			.pipe(gcmq())
			.pipe(dest("src/css"))
			.pipe(browserSync.stream())
	);
}

function watching() {
	watch(["src/img/src/**/*"], images);
	watch(["src/scss/**/*.scss"], styles);
	watch(["src/js/main.js"], scripts);
	watch(["src/components/*", "src/pages/*"], pages);
	watch(["src/*.html"]).on("change", browserSync.reload);
}

function browsersync() {
	browserSync.init({
		server: { baseDir: "src/" }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true, // Режим работы: true или false
	});
}

function clean() {
	return del("dist");
}
function building() {
	return src(
		[
			"src/css/*.css",
			"src/js/main.min.js",
			"src/**/*.html",
			"src/img/*.*",
			"!src/img/stack/*.*",
			"!src/img/*.svg",
			"src/img/sprite.svg",
			"src/font/*.{ttf,woff2,woff}",
		],
		{
			base: "src",
		}
	).pipe(dest("dist"));
}

exports.styles = styles;
exports.clean = clean;
exports.pages = pages;
exports.building = building;
exports.fonts = fonts;
exports.sprite = svg;
exports.scripts = scripts;
exports.images = images;
exports.build = series(clean, building);
exports.default = parallel(
	styles,
	scripts,
	pages,
	images,
	browsersync,
	watching
);
