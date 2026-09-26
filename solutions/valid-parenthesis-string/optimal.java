class Solution {
    public boolean checkValidString(String s) {
        int lo = 0, hi = 0;                                 // min / max possible unmatched "("
        for (char c : s.toCharArray()) {
            if (c == '(') { lo++; hi++; }
            else if (c == ')') { lo--; hi--; }
            else { lo--; hi++; }                            // * could close or open
            if (hi < 0) return false;                       // too many ")"
            lo = Math.max(lo, 0);
        }
        return lo == 0;
    }
}
