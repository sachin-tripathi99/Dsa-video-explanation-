class Solution {
public:
    string longestPrefix(string s) {
        const long long MOD = 1000000007LL, B = 131;
        int n = s.size(), best = 0;
        long long pre = 0, suf = 0, pw = 1;
        for (int k = 1; k < n; k++) {
            pre = (pre * B + s[k - 1]) % MOD;               // append on the right
            suf = (s[n - k] * pw + suf) % MOD;              // prepend on the left
            pw = pw * B % MOD;
            if (pre == suf) best = k;
        }
        return s.substr(0, best);
    }
};
