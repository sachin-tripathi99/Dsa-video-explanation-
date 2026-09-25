class Solution {
    public int strStr(String haystack, String needle) {
        int n = haystack.length(), m = needle.length();
        for (int s = 0; s + m <= n; s++) {
            int j = 0;
            while (j < m && haystack.charAt(s + j) == needle.charAt(j)) j++;
            if (j == m) return s;
        }
        return -1;
    }
}
