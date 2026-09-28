class Solution {
    bool oneApart(const string& a, const string& b) {
        int diff = 0;
        for (size_t i = 0; i < a.size(); i++) if (a[i] != b[i] && ++diff > 1) return false;
        return diff == 1;
    }
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        if (find(wordList.begin(), wordList.end(), endWord) == wordList.end()) return 0;
        unordered_set<string> seen{beginWord};
        queue<string> q;
        q.push(beginWord);
        for (int d = 1; !q.empty(); d++) {
            for (int k = q.size(); k > 0; k--) {
                string w = q.front(); q.pop();
                if (w == endWord) return d;
                for (auto& x : wordList)                    // compare with every word
                    if (!seen.count(x) && oneApart(w, x)) { seen.insert(x); q.push(x); }
            }
        }
        return 0;
    }
};
