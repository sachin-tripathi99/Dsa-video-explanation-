class Solution {
    public String reorganizeString(String s) {
        int n = s.length();
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) cnt[c - 'a']++;
        int top = 0;
        for (int c = 0; c < 26; c++) if (cnt[c] > cnt[top]) top = c;
        if (cnt[top] > (n + 1) / 2) return "";              // cannot fit on even slots
        char[] out = new char[n];
        int i = 0;
        while (cnt[top]-- > 0) { out[i] = (char) ('a' + top); i += 2; }   // most frequent on evens
        for (int c = 0; c < 26; c++)
            while (cnt[c]-- > 0) {
                if (i >= n) i = 1;                          // wrap to odd slots
                out[i] = (char) ('a' + c);
                i += 2;
            }
        return new String(out);
    }
}
