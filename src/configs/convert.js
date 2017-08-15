import React from 'react'
import { blocks } from 'configs/maps'

const convertAtomicBlock = (block, contentState) => {

  const contentBlock = contentState.getBlockForKey(block.key)
  const entityKey = contentBlock.getEntityAt(0)
  const entity = contentState.getEntity(entityKey)
  const mediaType = entity.getType().toLowerCase()

  let { float, alignment } = block.data
  let { url, link, link_target, width, height } = entity.getData()

  if (mediaType === 'image') {

    let imageWrapStyle = {}

    if (float) {
      imageWrapStyle.float = float
    } else if (alignment) {
      imageWrapStyle.textAlign = alignment
    }

    if (link) {
      return (
        <div data-key={block.key} data-role="image-wrap" style={imageWrapStyle}>
          <a style={{display:'inline-block'}} href={link} target={link_target}>
            <img src={url} width={width} height={height} />
          </a>
        </div>
      )
    } else {
      return (
        <div data-key={block.key} data-role="image-wrap" style={imageWrapStyle}>
          <img src={url} width={width} height={height} />
        </div>
      )
    }

  } else if (mediaType === 'audio') {
    return <audio controls src={url} />
  } else if (mediaType === 'video') {
    return <video controls src={url} width={width} height={height} />
  } else {
    return <p></p>
  }

}

const styleToHTML = (props) => (style) => {

  style = style.toLowerCase()

  if (style === 'strikethrough') {
    return <span style={{textDecoration: 'line-through'}}/>
  } else if (style === 'superscript') {
    return <span style={{
      position: 'relative',
      top: '-8px',
      fontSize: '11px'
    }}/>
  } else if (style === 'subscript') {
    return <span style={{
      position: 'relative',
      bottom: '-8px',
      fontSize: '11px'
    }}/>
  } else if (style.indexOf('color-') === 0) {
    return <span style={{color: '#' + style.split('-')[1]}}/> 
  } else if (style.indexOf('bgcolor-') === 0) {
    return <span style={{backgroundColor: '#' + style.split('-')[1]}}/> 
  } else if (style.indexOf('fontsize-') === 0) {
    return <span style={{fontSize: style.split('-')[1] + 'px'}}/> 
  } else if (style.indexOf('fontfamily-') === 0) {
    let fontFamily = props.fontFamilies.find((item) => item.name.toLowerCase() === style.split('-')[1])
    return <span style={{fontFamily: fontFamily.family}}/> 
  }

}

const blockToHTML = (contentState) => (block) => {

  let result = null
  let blockStyle = ""

  const blockType = block.type.toLowerCase()
  const { textAlign } = block.data

  if (textAlign) {
    blockStyle = ` style="text-align:${textAlign};"`
  }

  if (blockType === 'atomic') {
    return convertAtomicBlock(block, contentState)
  } else if (blockType === 'code-block') {
    return {
      start: `<pre><code${blockStyle}>`,
      end: '</code></pre>'
    }
  } else if (blocks[blockType]) {
    return {
      start: `<${blocks[blockType]}${blockStyle}>`,
      end: `</${blocks[blockType]}>`
    }
  }

}

const entityToHTML = (entity, originalText) => {

  let result = originalText
  const entityType = entity.type.toLowerCase()

  if (entityType === 'link') {
    return <a href={entity.data.href} target={entity.data.target}>{originalText}</a>
  }

}

export const getToHTMLConfig = (props) => {

  return {
    styleToHTML: styleToHTML(props),
    entityToHTML: entityToHTML,
    blockToHTML: blockToHTML(props.contentState)
  }

}

export const getFromHTMLConfig = (contentState) => {

}