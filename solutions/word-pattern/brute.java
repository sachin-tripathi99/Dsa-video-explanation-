class Solution {
    public boolean wordPattern(String pattern, String s) {
        String[] w = s.split(" ");
        int n = pattern.length();
        if (w.length != n) return false;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if ((pattern.charAt(i) == pattern.charAt(j)) != w[i].equals(w[j])) return false;
        return true;
    }
}
