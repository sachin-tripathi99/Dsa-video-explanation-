class Solution {
    private int back(String s, int i) {                  // index of the next real char at or before i
        int skip = 0;
        while (i >= 0) {
            if (s.charAt(i) == '#') { skip++; i--; }
            else if (skip > 0) { skip--; i--; }
            else break;
        }
        return i;
    }

    public boolean backspaceCompare(String s, String t) {
        int i = s.length() - 1, j = t.length() - 1;
        while (true) {
            i = back(s, i);
            j = back(t, j);
            if (i < 0 || j < 0) return i < 0 && j < 0;   // both must run out together
            if (s.charAt(i) != t.charAt(j)) return false;
            i--;
            j--;
        }
    }
}
