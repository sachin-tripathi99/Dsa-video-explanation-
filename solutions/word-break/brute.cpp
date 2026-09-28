class Solution {
    bool can(const string& s, int start, unordered_set<string>& dict) {
        if (start == (int)s.size()) return true;
        for (int end = start + 1; end <= (int)s.size(); end++)   // try every first word
            if (dict.count(s.substr(start, end - start)) && can(s, end, dict)) return true;
        return false;
    }
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        return can(s, 0, dict);
    }
};
