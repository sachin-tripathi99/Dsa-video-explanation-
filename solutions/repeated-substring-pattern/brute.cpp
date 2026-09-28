class Solution {
public:
    bool repeatedSubstringPattern(string s) {
        int n = s.size();
        for (int len = 1; len <= n / 2; len++) {
            if (n % len) continue;                          // the block must divide n
            int i = len;
            while (i < n && s[i] == s[i - len]) i++;        // equal to the char one block earlier
            if (i == n) return true;
        }
        return false;
    }
};
