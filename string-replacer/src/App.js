import React, { useState } from 'react';
import DiffMatchPatch from 'diff-match-patch';

const App = () => {
  const [inputString1, setInputString1] = useState('');
  const [replaceableString1, setReplaceableString1] = useState('');
  const [replaceString1, setReplaceString1] = useState('');
  const [outputString1, setOutputString1] = useState('');

  const [inputString2, setInputString2] = useState('');
  const [replaceableString2, setReplaceableString2] = useState('');
  const [replaceString2, setReplaceString2] = useState('');
  const [outputString2, setOutputString2] = useState('');

  const [comparisonResult1, setComparisonResult1] = useState('');
  const [comparisonResult2, setComparisonResult2] = useState('');
  const [summary, setSummary] = useState('');

  const dmp = new DiffMatchPatch();

  const handleReplace1 = () => {
    const replacedString1 = inputString1.split(replaceableString1).join(replaceString1);
    setOutputString1(replacedString1);
  };

  const handleReplace2 = () => {
    const replacedString2 = inputString2.split(replaceableString2).join(replaceString2);
    setOutputString2(replacedString2);
  };

  const compareStrings = () => {
    const diff = dmp.diff_main(outputString1, outputString2);
    dmp.diff_cleanupSemantic(diff);

    const htmlDiff1 = [];
    const htmlDiff2 = [];
    const missingFrom1 = [];
    const missingFrom2 = [];

    diff.forEach(([op, text]) => {
      if (op === 0) {
        // No change
        htmlDiff1.push(`<span class="text-gray-700">${text}</span>`);
        htmlDiff2.push(`<span class="text-gray-700">${text}</span>`);
      } else if (op === -1) {
        // Deletion from string 1 (i.e., missing in string 2)
        htmlDiff1.push(`<span class="text-red-500 bg-red-100">${text}</span>`);
        htmlDiff2.push(`<span class="text-gray-400">${text}</span>`);
        missingFrom2.push(text);
      } else if (op === 1) {
        // Addition to string 2 (i.e., missing in string 1)
        htmlDiff1.push(`<span class="text-gray-400">${text}</span>`);
        htmlDiff2.push(`<span class="text-red-500 bg-red-100">${text}</span>`);
        missingFrom1.push(text);
      }
    });

    setComparisonResult1(htmlDiff1.join(''));
    setComparisonResult2(htmlDiff2.join(''));

    const summaryMessage = `
      <strong>Summary:</strong><br>
      <strong>Missing from Result 1:</strong> ${missingFrom1.length > 0 ? missingFrom1.join(', ') : 'None'}<br>
      <strong>Missing from Result 2:</strong> ${missingFrom2.length > 0 ? missingFrom2.join(', ') : 'None'}
    `;

    setSummary(summaryMessage);
  };

  return (
    <div className="p-6 max-w-100 mx-auto">
      <h2 className="text-xl font-bold text-center mb-6">String Replacer with Side-by-Side Comparison</h2>

      <div className="grid grid-cols-2 gap-8">
        {/* Left side */}
        <div className="p-4 bg-white rounded-xl shadow-md space-y-4">
          <h3 className="text-lg font-bold">String Replacer 1</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">Input String 1:</label>
            <input
              type="text"
              value={inputString1}
              onChange={(e) => setInputString1(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Replaceable String 1:</label>
            <input
              type="text"
              value={replaceableString1}
              onChange={(e) => setReplaceableString1(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Replacement String 1:</label>
            <input
              type="text"
              value={replaceString1}
              onChange={(e) => setReplaceString1(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            onClick={handleReplace1}
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Replace String 1
          </button>

          {outputString1 && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <strong>Result 1:</strong> {outputString1}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="p-4 bg-white rounded-xl shadow-md space-y-4">
          <h3 className="text-lg font-bold">String Replacer 2</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">Input String 2:</label>
            <input
              type="text"
              value={inputString2}
              onChange={(e) => setInputString2(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Replaceable String 2:</label>
            <input
              type="text"
              value={replaceableString2}
              onChange={(e) => setReplaceableString2(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Replacement String 2:</label>
            <input
              type="text"
              value={replaceString2}
              onChange={(e) => setReplaceString2(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            onClick={handleReplace2}
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Replace String 2
          </button>

          {outputString2 && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <strong>Result 2:</strong> {outputString2}
            </div>
          )}
        </div>
      </div>

      {/* Compare Button */}
      <div className="mt-6 text-center">
        <button
          onClick={compareStrings}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Compare Strings
        </button>

        {comparisonResult1 && comparisonResult2 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-gray-100 rounded-md" dangerouslySetInnerHTML={{ __html: comparisonResult1 }}></div>
            <div className="p-4 bg-gray-100 rounded-md" dangerouslySetInnerHTML={{ __html: comparisonResult2 }}></div>
          </div>
        )}

        {summary && (
          <div className="mt-4 p-4 bg-yellow-100 rounded-md" dangerouslySetInnerHTML={{ __html: summary }}></div>
        )}
      </div>
    </div>
  );
};

export default App;
