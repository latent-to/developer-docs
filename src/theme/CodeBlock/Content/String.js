import React from 'react';
import clsx from 'clsx';
import { useThemeConfig, usePrismTheme } from '@docusaurus/theme-common';
import {
	parseCodeBlockTitle,
	parseLanguage,
	parseLines,
	containsLineNumbers,
	useCodeWordWrap,
} from '@docusaurus/theme-common/internal';
import { Highlight } from 'prism-react-renderer';
import Line from '@theme/CodeBlock/Line';
import CopyButton from '@theme/CodeBlock/CopyButton';
import WordWrapButton from '@theme/CodeBlock/WordWrapButton';
import Container from '@theme/CodeBlock/Container';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

function FileIcon(props) {
	return (
		<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
			<path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z" />
		</svg>
	);
}

function normalizeLanguage(language) {
	return language?.toLowerCase();
}

export default function CodeBlockString({
	children,
	className: blockClassName = '',
	metastring,
	title: titleProp,
	showLineNumbers: showLineNumbersProp,
	language: languageProp,
}) {
	const {
		prism: { defaultLanguage, magicComments },
	} = useThemeConfig();
	const language = normalizeLanguage(
		languageProp ?? parseLanguage(blockClassName) ?? defaultLanguage,
	);
	const prismTheme = usePrismTheme();
	const wordWrap = useCodeWordWrap();

	let title = parseCodeBlockTitle(metastring) || titleProp;
	const fileRegex = /<file\s*\/>/;
	let isFileIconEnabled = false;
	if (fileRegex.test(title)) {
		isFileIconEnabled = true;
		title = title.replace(fileRegex, '');
	}

	const { lineClassNames, code } = parseLines(children, {
		metastring,
		language,
		magicComments,
	});
	const showLineNumbers =
		showLineNumbersProp ?? containsLineNumbers(metastring);
	const match = `${metastring}`.match(/link="([^"]+)"/);
	if (match) {
		title = <Link href={match[1]}> {title}</Link>;
	}

	return (
		<Container
			as="div"
			className={clsx(
				blockClassName,
				language &&
				!blockClassName.includes(`language-${language}`) &&
				`language-${language}`,
			)}>
			{title && (
				<div className={styles.codeBlockTitle}>
					{isFileIconEnabled ? <FileIcon className="codeTitleIcon" /> : null}
					{title}
				</div>
			)}
			<div className={styles.codeBlockContent}>
				<Highlight theme={prismTheme} code={code} language={language ?? 'text'}>
					{({ className, style, tokens, getLineProps, getTokenProps }) => (
						<pre
							tabIndex={0}
							ref={wordWrap.codeBlockRef}
							className={clsx(className, styles.codeBlock, 'thin-scrollbar')}
							style={style}>
							<code
								className={clsx(
									styles.codeBlockLines,
									showLineNumbers && styles.codeBlockLinesWithNumbering,
								)}>
								{tokens.map((line, i) => (
									<Line
										key={i}
										line={line}
										getLineProps={getLineProps}
										getTokenProps={getTokenProps}
										classNames={lineClassNames[i]}
										showLineNumbers={showLineNumbers}
									/>
								))}
							</code>
						</pre>
					)}
				</Highlight>
				<div className={styles.buttonGroup}>
					{(wordWrap.isEnabled || wordWrap.isCodeScrollable) && (
						<WordWrapButton
							className={styles.codeButton}
							onClick={() => wordWrap.toggle()}
							isEnabled={wordWrap.isEnabled}
						/>
					)}
					<CopyButton className={styles.codeButton} code={code} />
				</div>
			</div>
		</Container>
	);
}
