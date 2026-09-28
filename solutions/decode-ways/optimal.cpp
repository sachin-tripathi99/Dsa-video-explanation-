class Solution {
public:
    int numDecodings(string s) {
        int prev2 = 1, prev1 = s[0] == '0' ? 0 : 1;         // dp[i − 2], dp[i − 1]
        for (int i = 2; i <= (int)s.size(); i++) {
            int cur = 0;
            if (s[i - 1] != '0') cur += prev1;              // last digit alone
            int two = (s[i - 2] - '0') * 10 + (s[i - 1] - '0');
            if (s[i - 2] != '0' && two <= 26) cur += prev2; // last two digits
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
};
