class Solution {
public:
    string shortestPalindrome(string s) {
        int n = s.size();
        for (int k = n; k > 0; k--) {
            int l = 0, r = k - 1;
            while (l < r && s[l] == s[r]) { l++; r--; }
            if (l >= r) {                                   // s[0..k) is a palindrome
                string add = s.substr(k);
                reverse(add.begin(), add.end());
                return add + s;
            }
        }
        return s;
    }
};
