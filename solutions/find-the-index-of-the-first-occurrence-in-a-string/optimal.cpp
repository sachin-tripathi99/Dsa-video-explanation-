class Solution {
public:
    int strStr(string haystack, string needle) {
        int n = haystack.size(), m = needle.size();
        vector<int> lps(m, 0);                       // longest proper prefix that is also a suffix
        for (int i = 1, len = 0; i < m; ) {
            if (needle[i] == needle[len]) lps[i++] = ++len;
            else if (len > 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
        for (int i = 0, j = 0; i < n; ) {
            if (haystack[i] == needle[j]) {
                i++; j++;
                if (j == m) return i - m;
            } else if (j > 0) {
                j = lps[j - 1];                       // reuse the matched prefix; i stays
            } else {
                i++;
            }
        }
        return -1;
    }
};
