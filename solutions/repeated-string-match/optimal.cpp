class Solution {
public:
    int repeatedStringMatch(string a, string b) {
        int m = b.size(), n = a.size();
        int q = (m + n - 1) / n;
        string t;
        for (int k = 0; k <= q; k++) t += a;                // b must start in the first copy
        vector<int> lps(m);
        for (int i = 1, len = 0; i < m; ) {
            if (b[i] == b[len]) lps[i++] = ++len;
            else if (len) len = lps[len - 1];
            else lps[i++] = 0;
        }
        for (int i = 0, j = 0; i < (int)t.size(); i++) {
            while (j > 0 && t[i] != b[j]) j = lps[j - 1];
            if (t[i] == b[j]) j++;
            if (j == m) return (i + n) / n;                 // ceil((i + 1) / |a|) copies
        }
        return -1;
    }
};
