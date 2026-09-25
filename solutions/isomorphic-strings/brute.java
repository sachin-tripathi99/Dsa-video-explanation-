class Solution {
    public boolean isIsomorphic(String s, String t) {
        int n = s.length();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if ((s.charAt(i) == s.charAt(j)) != (t.charAt(i) == t.charAt(j))) return false;
        return true;
    }
}
