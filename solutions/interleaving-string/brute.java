class Solution {
    public boolean isInterleave(String s1, String s2, String s3) {
        if (s1.length() + s2.length() != s3.length()) return false;
        return ok(s1, s2, s3, 0, 0);
    }

    private boolean ok(String a, String b, String c, int i, int j) {
        if (i == a.length() && j == b.length()) return true;
        char want = c.charAt(i + j);                        // position in s3 is i + j
        return (i < a.length() && a.charAt(i) == want && ok(a, b, c, i + 1, j))
            || (j < b.length() && b.charAt(j) == want && ok(a, b, c, i, j + 1));
    }
}
