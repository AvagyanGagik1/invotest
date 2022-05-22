import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
} from '@draft-js-plugins/buttons';
import editorStyles from './editorStyles.module.css';

import linkStyles from './linkStyles.module.css';

const linkPlugin = createLinkPlugin({
    theme: linkStyles,
    placeholder: 'http://…',
});
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin, linkPlugin];
const text =
    'Try selecting a part of this text and click on the link button in the toolbar that appears …';
class HeadlinesPicker extends Component {
    componentDidMount() {
        setTimeout(() => {
            window.addEventListener('click', this.onWindowClick);
        });
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onWindowClick);
    }

    onWindowClick = () =>
        this.props.onOverrideContent(undefined);

    render() {
        const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
        return (
            <div>
                {buttons.map((Button, i) => (
                    <Button key={i} {...this.props} />
                ))}
            </div>
        );
    }
}

class HeadlinesButton extends Component {
    onMouseDown = (event) => event.preventDefault();

    onClick = () =>
        this.props.onOverrideContent(HeadlinesPicker);

    render() {
        return (
            <div
                onMouseDown={this.onMouseDown}
                className={editorStyles.headlineButtonWrapper}
            >
                <button onClick={this.onClick} className={editorStyles.headlineButton}>
                    H1
                </button>
            </div>
        );
    }
}

export default class ThemedInlineToolbarEditor extends Component {
    state = {
        editorState: createEditorStateWithText(text),
    };

    onChange = (editorState) => this.setState({ editorState });

    focus = () => this.editor.focus();

    render() {
        return (
            <div className={editorStyles.editor} onClick={this.focus}>
                <Editor
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    plugins={plugins}
                    ref={(element) => {
                        this.editor = element;
                    }}
                />
                <InlineToolbar>
                    {
                        (externalProps) => (
                            <div>
                                <BoldButton {...externalProps} />
                                <ItalicButton {...externalProps} />
                                <UnderlineButton {...externalProps} />
                                <HeadlinesButton {...externalProps} />
                                <UnorderedListButton {...externalProps} />
                                <OrderedListButton {...externalProps} />
                                <linkPlugin.LinkButton {...externalProps} />
                            </div>
                        )
                    }
                </InlineToolbar>
            </div>
        );
    }
}