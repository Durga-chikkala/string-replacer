import React, { useState, useEffect } from 'react';
import DiffMatchPatch from 'diff-match-patch';

const App = () => {
  const [input1, setInput1] = useState('');
  const [replaceable1, setReplaceable1] = useState('');
  const [replace1, setReplace1] = useState('');
  const [output1, setOutput1] = useState('');

  const [input2, setInput2] = useState('');
  const [replaceable2, setReplaceable2] = useState('');
  const [replace2, setReplace2] = useState('');
  const [output2, setOutput2] = useState('');

  const [comparisonResult1, setComparisonResult1] = useState('');
  const [comparisonResult2, setComparisonResult2] = useState('');
  const [summary, setSummary] = useState('');
  const [mode, setMode] = useState('strings'); // mode can be "strings" or "json"

  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const dmp = new DiffMatchPatch();

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 1000); // Alert disappears after 1 second
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleReplace1 = () => {
    try {
      if (mode === 'json') {
        const json = JSON.parse(input1);
        const replacedJSON = JSON.stringify(json).split(replaceable1).join(replace1);
        setOutput1(JSON.stringify(JSON.parse(replacedJSON), null, 2)); // Pretty print
      } else {
        setOutput1(input1.split(replaceable1).join(replace1));
      }
    } catch (error) {
      showCustomAlert('Invalid JSON in Input 1');
    }
  };

  const handleReplace2 = () => {
    try {
      if (mode === 'json') {
        const json = JSON.parse(input2);
        const replacedJSON = JSON.stringify(json).split(replaceable2).join(replace2);
        setOutput2(JSON.stringify(JSON.parse(replacedJSON), null, 2)); // Pretty print
      } else {
        setOutput2(input2.split(replaceable2).join(replace2));
      }
    } catch (error) {
      showCustomAlert('Invalid JSON in Input 2');
    }
  };

  const compareStrings = () => {
    let diff;
    try {
      if (mode === 'json') {
        diff = dmp.diff_main(
          JSON.stringify(JSON.parse(output1), null, 2),
          JSON.stringify(JSON.parse(output2), null, 2)
        );
      } else {
        diff = dmp.diff_main(output1, output2);
      }
    } catch (error) {
      showCustomAlert('Invalid JSON for comparison');
      return;
    }

    dmp.diff_cleanupSemantic(diff);

    const htmlDiff1 = [];
    const htmlDiff2 = [];
    const missingFrom1 = [];
    const missingFrom2 = [];
    let totalDifferences = 0;
    let identicalLines = 0;
    let totalLines = diff.length;

    diff.forEach(([op, text]) => {
      if (op === 0) {
        htmlDiff1.push(`<span class="text-gray-700">${text}</span>`);
        htmlDiff2.push(`<span class="text-gray-700">${text}</span>`);
        identicalLines++;
      } else if (op === -1) {
        htmlDiff1.push(`<span class="text-red-500 bg-red-100">${text}</span>`);
        missingFrom2.push(text);
        totalDifferences++;
      } else if (op === 1) {
        htmlDiff2.push(`<span class="text-red-500 bg-red-100">${text}</span>`);
        missingFrom1.push(text);
        totalDifferences++;
      }
    });

    setComparisonResult1(htmlDiff1.join(''));
    setComparisonResult2(htmlDiff2.join(''));

    const similarityPercentage = ((identicalLines / totalLines) * 100).toFixed(2);

    const detailedSummary = `
      <strong>Summary of Differences:</strong><br />
      <strong>Total Differences:</strong> ${totalDifferences}<br />
      <strong>Percentage Similarity:</strong> ${similarityPercentage}%<br />
      <strong>Missing from Output 1:</strong><br /> ${missingFrom1.length ? missingFrom1.join(', ') : 'None'}<br />
      <strong>Missing from Output 2:</strong><br /> ${missingFrom2.length ? missingFrom2.join(', ') : 'None'}<br />
      <strong>Total Lines Compared:</strong> ${totalLines}<br />
      <strong>Identical Lines:</strong> ${identicalLines}<br />
      <strong>Status:</strong> ${totalDifferences === 0 ? 'Both outputs are identical.' : 'There are differences between the two outputs.'}
    `;

    setSummary(detailedSummary);
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
    setInput1('');
    setInput2('');
    setReplaceable1('');
    setReplaceable2('');
    setReplace1('');
    setReplace2('');
    setOutput1('');
    setOutput2('');
    setComparisonResult1('');
    setComparisonResult2('');
    setSummary('');
  };

  const handleInputResize = (event) => {
    event.target.style.height = 'auto';  // Reset the height
    event.target.style.height = `${event.target.scrollHeight}px`;  // Adjust height based on content
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showCustomAlert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center py-10 px-6">
      {/* Custom Alert */}
      {showAlert && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center p-4">
          {alertMessage}
        </div>
      )}

      <div 
        className="bg-white w-screen shadow-2xl rounded-2xl p-8 min-h-screen"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-center text-indigo-600 mb-2">DataSnap</h1>
        <p className='text-center mb-6 text-indigo-600'>Snap Your Strings and JSONs into Place, Discover the Gaps!</p>

        <div className="flex justify-center items-center mb-8">
          <label className="text-lg font-medium mr-4">Mode:</label>
          <select
            value={mode}
            onChange={handleModeChange}
            className="border border-gray-300 rounded-lg p-2 w-40 bg-indigo-50 text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            whileHover={{ scale: 1.01 }}
          >
            <option value="strings">Strings</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Input 1</h3>

            {mode === 'json' ? (
              <textarea
                value={input1}
                onChange={(e) => {
                  setInput1(e.target.value);
                  handleInputResize(e);
                }}
                placeholder="Enter JSON"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                style={{ overflow: 'hidden', resize: 'none' }}
              />
            ) : (
              <input
                type="text"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder="Enter String"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            )}

            <input
              type="text"
              value={replaceable1}
              onChange={(e) => setReplaceable1(e.target.value)}
              placeholder="String to replace"
              className="mt-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            />

            <input
              type="text"
              value={replace1}
              onChange={(e) => setReplace1(e.target.value)}
              placeholder="Replacement string"
              className="mt-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            />

            <button
              onClick={handleReplace1}
              className="mt-6 w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              Replace in Input 1
            </button>

            {output1 && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow-inner">
                <h4 className="font-medium text-gray-700 flex justify-between">
                  Output 1:
                  <button onClick={() => copyToClipboard(output1)} className="text-blue-600 hover:underline">
                    Copy
                  </button>
                </h4>
                <pre>{output1}</pre>
              </div>
            )}
          </div>

          {/* Input 2 */}
          <div
            className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Input 2</h3>

            {mode === 'json' ? (
              <textarea
                value={input2}
                onChange={(e) => {
                  setInput2(e.target.value);
                  handleInputResize(e);
                }}
                placeholder="Enter JSON"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                style={{ overflow: 'hidden', resize: 'none' }}
              />
            ) : (
              <input
                type="text"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Enter String"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            )}

            <input
              type="text"
              value={replaceable2}
              onChange={(e) => setReplaceable2(e.target.value)}
              placeholder="String to replace"
              className="mt-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            />

            <input
              type="text"
              value={replace2}
              onChange={(e) => setReplace2(e.target.value)}
              placeholder="Replacement string"
              className="mt-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            />

            <button
              onClick={handleReplace2}
              className="mt-6 w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              Replace in Input 2
            </button>

            {output2 && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow-inner">
                <h4 className="font-medium text-gray-700 flex justify-between">
                  Output 2:
                  <button onClick={() => copyToClipboard(output2)} className="text-blue-600 hover:underline">
                    Copy
                  </button>
                </h4>
                <pre>{output2}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Section */}
        {output1 && output2 && (
          <div className="mt-12">
            <button
              onClick={compareStrings}
              className="w-full bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              Compare Outputs
            </button>

            {comparisonResult1 && comparisonResult2 && (
              <div className="mt-6">
                <div className="flex justify-between gap-8">
                  <div className="w-full bg-white p-4 rounded-lg shadow-inner">
                    <h4 className="font-medium text-gray-700 flex justify-between">
                      Comparison for Output 1:
                      <button onClick={() => copyToClipboard(output1)} className="text-blue-600 hover:underline">
                        Copy
                      </button>
                    </h4>
                    <pre dangerouslySetInnerHTML={{ __html: comparisonResult1 }} />
                  </div>
                  <div className="w-full bg-white p-4 rounded-lg shadow-inner">
                    <h4 className="font-medium text-gray-700 flex justify-between">
                      Comparison for Output 2:
                      <button onClick={() => copyToClipboard(output2)} className="text-blue-600 hover:underline">
                        Copy
                      </button>
                    </h4>
                    <pre dangerouslySetInnerHTML={{ __html: comparisonResult2 }} />
                  </div>
                </div>

                <div className="mt-6 bg-white p-4 rounded-lg shadow-inner">
                  <h4 className="font-medium text-gray-700 flex justify-between">
                    <strong>Detailed Summary:</strong>
                    <button onClick={() => copyToClipboard(summary)} className="text-blue-600 hover:underline">
                      Copy
                    </button>
                  </h4>
                  <pre dangerouslySetInnerHTML={{ __html: summary }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
