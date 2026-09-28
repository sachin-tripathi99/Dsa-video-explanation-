class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        int maxLen = 0;
        for (auto& w : wordDict) maxLen = max(maxLen, (int)w.size());
        int n = s.size();
        vector<bool> dp(n + 1, false);                      // dp[i]: first i chars can be split
        dp[0] = true;
        for (int i = 1; i <= n; i++)
            for (int j = i - 1; j >= max(0, i - maxLen); j--)
                if (dp[j] && dict.count(s.substr(j, i - j))) { dp[i] = true; break; }
        return dp[n];
    }
};
