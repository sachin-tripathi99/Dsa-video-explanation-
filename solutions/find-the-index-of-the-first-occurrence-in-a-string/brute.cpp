class Solution {
public:
    int strStr(string haystack, string needle) {
        int n = haystack.size(), m = needle.size();
        for (int s = 0; s + m <= n; s++) {
            int j = 0;
            while (j < m && haystack[s + j] == needle[j]) j++;
            if (j == m) return s;
        }
        return -1;
    }
};
