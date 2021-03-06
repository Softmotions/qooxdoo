#!/bin/bash

MASTER="master"

# Skip builds if no tag is set
if [ "$GH_USER_EMAIL" = "" ]; then
  echo "Skipping SDK generation for regular build."
  exit 0
fi

if [ "$TRAVIS_BRANCH" = "$MASTER" -o "$TRAVIS_TAG" != "" ]; then
  echo "Building release archive - please stand by"
else
  echo "No TAG / master: skipping creation of release archive."
  exit 0
fi

BASE_DIR="$(git rev-parse --show-toplevel)"
BRANCH=$(git describe --contains --all HEAD)
REV=$(git rev-parse --short HEAD)
FRAMEWORK_VERSION=$(cat $BASE_DIR/version.txt)
FRAMEWORK_GITINFO=$BRANCH:$REV

# Adjust the framework version for non TAG builds
if [ "$TRAVIS_TAG" = "" ]; then
    FRAMEWORK_VERSION="$FRAMEWORK_VERSION-$REV"
fi

TARGET_DIR="$BASE_DIR/dist"
SKEL_DIR=$BASE_DIR/component/skeleton/mobile/source/resource
RES_DIR=$BASE_DIR/framework/source/resource/qx/mobile

RELEASE_BUILD="$TARGET_DIR/temp/build/qooxdoo-${FRAMEWORK_VERSION}-build"
RELEASE_SDK="$TARGET_DIR/temp/sdk/qooxdoo-${FRAMEWORK_VERSION}-sdk"

SYNC="rsync --recursive --delete --inplace --links --safe-links --exclude='.git*'"
GENERATE="python $BASE_DIR/tool/bin/generator.py"

SCSS_FRAMEWORK_OPTS="--no-cache --style compressed"
FILES_TEXT="( -name "*.py" -o -name "*.sh" -o -name "*.js" -o -name "*.html" -o -name "*.css" -o -name "*.xml" -o -name Makefile -o -name AUTHORS -o -name LICENSE -o -name README -o -name RELEASENOTES -o -name TODO )"
APPLICATIONS="websitewidgetbrowser tutorial todo feedreader mobileshowcase playground showcase widgetbrowser github demobrowser"
COMPONENTS="apiviewer testrunner server website"

export PYTHONPATH=$BASE_DIR/tool/pylib

function make-release-sdk()
{
    echo "Building release:"
    echo "  * stripping source..."
    mkdir -p $RELEASE_SDK
    git archive $BRANCH $BASE_DIR | tar -x -C $RELEASE_SDK
    
    echo "  * adapting index.html..."
    sed 's/class="local"/class="local hide"/g;s/ class="publish"//g' $BASE_DIR/index.html > $RELEASE_SDK/index.html
    
    echo "  * create readme.html..."
    rm $RELEASE_SDK/readme.rst
    rst2html $BASE_DIR/readme.rst > $RELEASE_SDK/readme.html

    echo "  * mark applications to need generated..."
    for APPLICATION in $APPLICATIONS; do
        mkdir -p $RELEASE_SDK/application/$APPLICATION/source/script
        $SYNC $BASE_DIR/tool/data/generator/needs_generation.js $RELEASE_SDK/application/$APPLICATION/source/script/$APPLICATION.js
    done

    echo "  * syncing pre built showcase..."
    $SYNC $BASE_DIR/application/showcase/build/* $RELEASE_SDK/application/showcase/build

    echo "  * syncing components..."
    for COMPONENT in server website; do
        mkdir -p $RELEASE_SDK/component/standalone/$COMPONENT/script

        for F in $BASE_DIR/component/standalone/$COMPONENT/script/q*.js; do
            L=$(basename $F)
            if [[ ( "$COMPONENT" == "website" ) && ( "$L" =~ 'q-source' ) ]] ; then
                continue
            fi

            $SYNC $F $RELEASE_SDK/component/standalone/$COMPONENT/script/$L
        done

        if [ "$COMPONENT" == "website" ]; then \
            $SYNC $BASE_DIR/component/standalone/$COMPONENT/api/* $RELEASE_SDK/component/standalone/$COMPONENT/api
        fi
    done

    echo "  * syncing framework..."
    $SYNC $BASE_DIR/framework/api/* $RELEASE_SDK/framework/api
    mkdir -p $RELEASE_SDK/framework/source/script
    $SYNC $BASE_DIR/framework/source/script/dependencies.json $RELEASE_SDK/framework/source/script/dependencies.json

    echo "  * removing tools..."
    rm -rf $RELEASE_SDK/tool/admin/

    echo "  * adjust line endings to UNIX style..."
    find $RELEASE_SDK $FILES_TEXT -print0 | xargs -0 python tool/pylib/misc/textutil.py --command any2Unix

    echo "  * syncing documentation..."
    rm -rf $RELEASE_SDK/documentation/manual/
    rm -rf $RELEASE_SDK/documentation/tech_manual/
    mkdir -p $RELEASE_SDK/documentation/manual/
    $SYNC $BASE_DIR/documentation/manual/build/html/* $RELEASE_SDK/documentation/manual/
    $SYNC $BASE_DIR/documentation/manual/build/latex/qooxdoo.pdf $RELEASE_SDK/documentation/manual/

    rm -rf $RELEASE_SDK/.travis*
    rm -rf $RELEASE_SDK/.editorconfig
    rm -rf $RELEASE_SDK/.gitmodules
}


function make-release-zip()
{
    echo "Building release archive..."
    rm -f $TARGET_DIR/qooxdoo-${FRAMEWORK_VERSION}-sdk.zip
    cd $TARGET_DIR/temp/sdk
    zip -rq9 $TARGET_DIR/qooxdoo-${FRAMEWORK_VERSION}-sdk.zip qooxdoo-${FRAMEWORK_VERSION}-sdk
}


function clean-up()
{
    echo "Cleaning up..."
    rm -rf $TARGET_DIR/temp
    echo "Done."
}


function build-docs()
{
    TOOL_RESOURCES=$BASE_DIR/tool/admin/www/resources
    MANUAL=$BASE_DIR/documentation/manual
    THEME=_theme.indigo

    echo "Building documentation:"

    echo "  * syncing CSS..."
    for F in base.css layout.css reset.css; do
        $SYNC $TOOL_RESOURCES/stylesheets/$F $MANUAL/source/$THEME/copies &> /dev/null
    done

    echo "  * syncing javascript..."
    for F in application.js html5shiv.js q.js q.placeholder.js q.sticky.js; do
        $SYNC $TOOL_RESOURCES/javascripts/$F $MANUAL/source/$THEME/copies &> /dev/null
    done

    echo "  * building HTML..."
    (cd $MANUAL && QOOXDOO_RELEASE=1 make html)
    (cd $BASE_DIR/documentation/tech_manual && make html &> /dev/null)

    echo "  * building PDF..."
    (cd $MANUAL && QOOXDOO_RELEASE=1 make latex &> /dev/null)
    (cd $MANUAL/build/latex && make all-pdf &> /dev/null)
}


function build-framework-api()
{
    echo "Building framework API..."
    (cd $BASE_DIR/framework && $GENERATE api &> /dev/null)
}


function build-framework-dependencies()
{
    echo "Building framework dependencies..."
    (cd $BASE_DIR/framework && $GENERATE dependencies &> /dev/null)
}


function build-showcase()
{
    echo "Building showcase..."
    (cd $BASE_DIR/application/showcase && $GENERATE build &> /dev/null)
}


function build-framework-css()
{
    echo "Compilling framework CSS..."
    (
    cd $SKEL_DIR/custom/scss/

    for SCSS_FILE in `ls [!_]*.scss`; do
        echo "    - mobile-skeleton: $SCSS_FILE..."
        sass $SCSS_FRAMEWORK_OPTS -I $RES_DIR/scss -I $RES_DIR/scss/theme/indigo -I $RES_DIR/../scss $SCSS_FILE ../css/${SCSS_FILE/%.scss/.css}
    done

    for APP in mobileshowcase playground feedreader tutorial; do
        cd $BASE_DIR/application/$APP/source/resource/$APP/scss/
        for SCSS_FILE in `ls [!_]*.scss`; do
            echo "    - $APP: $SCSS_FILE..."
            sass $SCSS_FRAMEWORK_OPTS -I $RES_DIR/scss -I $RES_DIR/scss/theme/indigo -I $RES_DIR/../scss $SCSS_FILE ../css/${SCSS_FILE/%.scss/.css}
        done
    done

    for COMP in testrunner; do
        if [ "$COMP" = "testrunner" ]; then
            cd $BASE_DIR/component/$COMP/source/resource/$COMP/view/mobile/scss/
            for SCSS_FILE in `ls [!_]*.scss`; do
                echo "    - $COMP: $SCSS_FILE..."
                sass $SCSS_FRAMEWORK_OPTS -I $RES_DIR/scss -I $RES_DIR/scss/theme/indigo -I $RES_DIR/../scss $SCSS_FILE ../css/${SCSS_FILE/%.scss/.css}
            done
        else
            cd $BASE_DIR/component/$COMP/source/resource/$COMP/scss/
            for SCSS_FILE in `ls [!_]*.scss`; do
                echo "    - $COMP: $SCSS_FILE..."
                sass $SCSS_FRAMEWORK_OPTS -I $RES_DIR/scss -I $RES_DIR/scss/theme/indigo -I $RES_DIR/../scss $SCSS_FILE ../css/${SCSS_FILE/%.scss/.css}
            done
        fi
    done
    )
}


function build-website-api()
{
    echo "Building website API..."
    (cd $BASE_DIR/component/standalone/website && grunt api)
}


function build-website-sdk()
{
    echo "Building website SDK..."
    (cd $BASE_DIR/component/standalone/website && $GENERATE build,build-min,build-module-all,build-module-all-min &> /dev/null)
}


function build-server-sdk()
{
    echo "Building server SDK..."
    (cd $BASE_DIR/component/standalone/server && $GENERATE build,build-min &> /dev/null)
}


function distclean()
{
    echo "Cleaning up:"
    echo "  * documentation..."
    (cd $BASE_DIR/documentation/manual && make clean &> /dev/null)

    echo "  * applications..."
    for APPLICATION in $APPLICATIONS; do
        F="application/$APPLICATION"
        if [ -e $F -a "$APPLICATION" != "websitewidgetbrowser" ]; then
            (cd $F && $GENERATE distclean &> /dev/null) || ( echo "!!! unable to distclean $F"; exit 1 )
        fi
    done

    echo "  * components..."
    for COMPONENT in $COMPONENTS; do
        if [[ "$COMPONENT" == server || "$COMPONENT" == website ]]; then
            F="component/standalone/$COMPONENT"
        else
            F="component/$COMPONENT"
        fi
        if [ -e $F ]; then
            ( cd $F && $GENERATE distclean &> /dev/null) || ( echo "!!! unable to distclean $F"; exit 1 )
        fi
        done

    echo "  * framework..."
    (cd $BASE_DIR/framework && $GENERATE distclean &> /dev/null)

    echo "  * dist tree..."
    rm -rf $TARGET_DIR
    mkdir -p $TARGET_DIR
}

#
# ================================================================================
#


echo "-------------------------------------------------------------------------"
echo "Framework version: $FRAMEWORK_VERSION"
echo "Framework info   : $FRAMEWORK_GITINFO"
echo "Build source     : $BASE_DIR"
echo "Target           : $TARGET_DIR"
echo "-------------------------------------------------------------------------"

cd $BASE_DIR
tool/admin/bin/bumpqxversion.py $FRAMEWORK_VERSION
distclean

build-framework-api && \
build-framework-dependencies && \
build-framework-css && \
build-website-api && \
build-website-sdk && \
build-server-sdk && \
build-showcase && \
build-docs && \
make-release-sdk && \
make-release-zip && \
clean-up
