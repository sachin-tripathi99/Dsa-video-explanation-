class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> words(wordList.begin(), wordList.end());
        if (!words.count(endWord)) return 0;
        unordered_set<string> seen{beginWord};
        queue<string> q;
        q.push(beginWord);
        for (int d = 1; !q.empty(); d++) {
            for (int k = q.size(); k > 0; k--) {
                string w = q.front(); q.pop();
                if (w == endWord) return d;
                for (size_t i = 0; i < w.size(); i++) {
                    char orig = w[i];
                    for (char ch = 'a'; ch <= 'z'; ch++) {  // change letter i
                        w[i] = ch;
                        if (words.count(w) && seen.insert(w).second) q.push(w);
                    }
                    w[i] = orig;
                }
            }
        }
        return 0;
    }
};
