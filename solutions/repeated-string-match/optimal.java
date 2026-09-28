class Solution {
    public int repeatedStringMatch(String a, String b) {
        int m = b.length();
        int q = (m + a.length() - 1) / a.length();
        String t = a.repeat(q + 1);                         // b must start in the first copy
        int[] lps = new int[m];
        for (int i = 1, len = 0; i < m; ) {
            if (b.charAt(i) == b.charAt(len)) lps[i++] = ++len;
            else if (len > 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
        for (int i = 0, j = 0; i < t.length(); i++) {
            while (j > 0 && t.charAt(i) != b.charAt(j)) j = lps[j - 1];
            if (t.charAt(i) == b.charAt(j)) j++;
            if (j == m) return (i + a.length()) / a.length();   // ceil((i + 1) / |a|) copies
        }
        return -1;
    }
}
