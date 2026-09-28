class Solution {
    public int repeatedStringMatch(String a, String b) {
        StringBuilder t = new StringBuilder();
        for (int k = 1; t.length() <= b.length() + 2 * a.length(); k++) {
            t.append(a);                                    // k copies of a
            if (t.indexOf(b) >= 0) return k;
        }
        return -1;
    }
}
