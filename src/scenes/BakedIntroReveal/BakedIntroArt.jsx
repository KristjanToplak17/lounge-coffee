import React from "react";
import { assetMap } from "../../utils/assetMap";
import { bakedIntroAssets } from "./bakedIntroAssets";
import { FRAGMENTS, getFragmentStyles } from "./bakedIntroShared";

const RIGHT_EXTENSION_OVERLAP_PX = 2;

export function BakedIntroArt({
  prefix,
  geometry,
  leftPanelGroupRef,
  rightPanelGroupRef,
  leftContentGroupRef,
  rightContentGroupRef,
  leftSeamCapRef,
  rightSeamCapRef,
  rightShadowRef,
  leftFragmentRefs,
  rightFragmentRefs,
  logoRef,
  progressRef,
  progressFillRef
}) {
  return (
    <>
      <div className={`${prefix}__split-scene`} aria-hidden="true">
        <div
          ref={leftPanelGroupRef}
          className={`${prefix}__group ${prefix}__group--left ${prefix}__group--panel`}
          style={{
            left: `${geometry.leftGroup.left}px`,
            width: `${geometry.leftGroup.width}px`,
            height: `${geometry.panelHeight}px`
          }}
        >
          {geometry.leftGroup.extensionWidth > 0 ? (
            <div
              className={`${prefix}__extension ${prefix}__extension--left`}
              style={{
                left: `${-geometry.leftGroup.extensionWidth}px`,
                width: `${geometry.leftGroup.extensionWidth}px`,
                height: `${geometry.panelHeight}px`
              }}
            />
          ) : null}

          <div
            ref={leftSeamCapRef}
            className={`${prefix}__seam-cap ${prefix}__seam-cap--left`}
            style={{
              left: `${geometry.leftGroup.width - geometry.leftGroup.seamCapWidth}px`,
              width: `${geometry.leftGroup.seamCapWidth}px`,
              height: `${geometry.panelHeight}px`
            }}
          />

          <img
            className={`${prefix}__panel`}
            src={bakedIntroAssets.leftPanelAsset}
            alt=""
            draggable="false"
            style={{
              width: `${geometry.leftGroup.width}px`,
              height: `${geometry.panelHeight}px`
            }}
          />
        </div>

        <div
          ref={rightPanelGroupRef}
          className={`${prefix}__group ${prefix}__group--right ${prefix}__group--panel`}
          style={{
            left: `${geometry.rightGroup.left}px`,
            width: `${geometry.rightGroup.width}px`,
            height: `${geometry.panelHeight}px`
          }}
        >
          {geometry.rightGroup.extensionWidth > 0 ? (
            <div
              className={`${prefix}__extension ${prefix}__extension--right`}
              style={{
                left: `${geometry.rightGroup.width - RIGHT_EXTENSION_OVERLAP_PX}px`,
                width: `${geometry.rightGroup.extensionWidth + RIGHT_EXTENSION_OVERLAP_PX}px`,
                height: `${geometry.panelHeight}px`
              }}
            />
          ) : null}

          <div
            ref={rightSeamCapRef}
            className={`${prefix}__seam-cap ${prefix}__seam-cap--right`}
            style={{
              left: "0px",
              width: `${geometry.rightGroup.seamCapWidth}px`,
              height: `${geometry.panelHeight}px`
            }}
          />

          <img
            className={`${prefix}__panel`}
            src={bakedIntroAssets.rightPanelAsset}
            alt=""
            draggable="false"
            style={{
              width: `${geometry.rightGroup.width}px`,
              height: `${geometry.panelHeight}px`
            }}
          />

          <img
            ref={rightShadowRef}
            className={`${prefix}__shadow ${prefix}__shadow--right`}
            src={assetMap.shadows.coffeeLeaf}
            alt=""
            draggable="false"
            style={{
              right: `${geometry.shadows.right.right}px`,
              top: `${geometry.shadows.right.top}px`,
              width: `${geometry.shadows.right.width}px`,
              height: `${geometry.shadows.right.height}px`
            }}
          />
        </div>

        <div
          ref={leftContentGroupRef}
          className={`${prefix}__group ${prefix}__group--left ${prefix}__group--content`}
          style={{
            left: `${geometry.leftGroup.left}px`,
            width: `${geometry.leftGroup.width}px`,
            height: `${geometry.panelHeight}px`
          }}
        >
          {assetMap.beanFragments.left.map((fragment, index) => {
            const styles = getFragmentStyles(FRAGMENTS.left[index], geometry.artScale);

            return (
              <img
                key={`left-fragment-${index + 1}`}
                ref={(node) => {
                  leftFragmentRefs.current[index] = node;
                }}
                className={`${prefix}__fragment ${prefix}__fragment--left`}
                src={fragment}
                alt=""
                draggable="false"
                style={{
                  left: `${styles.left}px`,
                  top: `${styles.top}px`,
                  width: `${styles.width}px`,
                  height: `${styles.height}px`
                }}
              />
            );
          })}

          <img
            className={`${prefix}__bean`}
            src={bakedIntroAssets.leftBeanAsset}
            alt=""
            draggable="false"
            style={{
              left: `${geometry.leftBean.left}px`,
              top: `${geometry.leftBean.top}px`,
              width: `${geometry.leftBean.width}px`,
              height: `${geometry.leftBean.height}px`
            }}
          />
        </div>

        <div
          ref={rightContentGroupRef}
          className={`${prefix}__group ${prefix}__group--right ${prefix}__group--content`}
          style={{
            left: `${geometry.rightGroup.left}px`,
            width: `${geometry.rightGroup.width}px`,
            height: `${geometry.panelHeight}px`
          }}
        >
          {assetMap.beanFragments.right.map((fragment, index) => {
            const styles = getFragmentStyles(FRAGMENTS.right[index], geometry.artScale);

            return (
              <img
                key={`right-fragment-${index + 1}`}
                ref={(node) => {
                  rightFragmentRefs.current[index] = node;
                }}
                className={`${prefix}__fragment ${prefix}__fragment--right`}
                src={fragment}
                alt=""
                draggable="false"
                style={{
                  left: `${styles.left}px`,
                  top: `${styles.top}px`,
                  width: `${styles.width}px`,
                  height: `${styles.height}px`
                }}
              />
            );
          })}

          <img
            className={`${prefix}__bean`}
            src={bakedIntroAssets.rightBeanAsset}
            alt=""
            draggable="false"
            style={{
              left: `${geometry.rightBean.left}px`,
              top: `${geometry.rightBean.top}px`,
              width: `${geometry.rightBean.width}px`,
              height: `${geometry.rightBean.height}px`
            }}
          />
        </div>
      </div>

      <div className={`${prefix}__loader-ui`}>
        <img
          ref={logoRef}
          className={`${prefix}__logo`}
          src={assetMap.logos.light}
          alt=""
          draggable="false"
          style={{
            top: `${geometry.logo.top}px`,
            width: `${geometry.logo.width}px`,
            height: `${geometry.logo.height}px`
          }}
        />

        <div
          ref={progressRef}
          className={`${prefix}__progress`}
          style={{
            top: `${geometry.progress.top}px`,
            width: `${geometry.progress.width}px`,
            height: `${geometry.progress.height}px`
          }}
        >
          <div ref={progressFillRef} className={`${prefix}__progress-fill`} />
        </div>
      </div>
    </>
  );
}
