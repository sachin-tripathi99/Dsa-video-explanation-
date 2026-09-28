class Solution {
    vector<int> memo;                                       // −1 unknown, 0 false, 1 true
    bool can(const string& s, int start, unordered_set<string>& dict) {
        if (start == (int)s.size()) return true;
        if (memo[start] != -1) return memo[start];          // this suffix solved before
        for (int end = start + 1; end <= (int)s.size(); end++)
            if (dict.count(s.substr(start, end - start)) && can(s, end, dict)) return memo[start] = 1;
        return memo[start] = 0;
    }
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        memo.assign(s.size(), -1);
        return can(s, 0, dict);
    }
};
