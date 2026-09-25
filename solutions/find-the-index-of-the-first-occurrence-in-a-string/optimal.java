class Solution {
    public int strStr(String haystack, String needle) {
        int n = haystack.length(), m = needle.length();
        int[] lps = new int[m];                       // longest proper prefix that is also a suffix
        for (int i = 1, len = 0; i < m; ) {
            if (needle.charAt(i) == needle.charAt(len)) lps[i++] = ++len;
            else if (len > 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
        for (int i = 0, j = 0; i < n; ) {
            if (haystack.charAt(i) == needle.charAt(j)) {
                i++; j++;
                if (j == m) return i - m;
            } else if (j > 0) {
                j = lps[j - 1];                        // reuse the matched prefix; i stays
            } else {
                i++;
            }
        }
        return -1;
    }
}
