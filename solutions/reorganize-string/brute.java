class Solution {
    public String reorganizeString(String s) {
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) cnt[c - 'a']++;
        char[] out = new char[s.length()];
        return place(0, out, cnt) ? new String(out) : "";
    }

    private boolean place(int i, char[] out, int[] cnt) {
        if (i == out.length) return true;
        for (int c = 0; c < 26; c++) {
            if (cnt[c] == 0 || (i > 0 && out[i - 1] == 'a' + c)) continue;
            cnt[c]--;
            out[i] = (char) ('a' + c);
            if (place(i + 1, out, cnt)) return true;
            cnt[c]++;                                   // undo
        }
        return false;
    }
}
