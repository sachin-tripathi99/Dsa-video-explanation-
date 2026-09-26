class Solution {
    public String removeDuplicates(String s) {
        boolean changed = true;
        while (changed) {
            changed = false;
            for (int i = 0; i + 1 < s.length(); i++)
                if (s.charAt(i) == s.charAt(i + 1)) {
                    s = s.substring(0, i) + s.substring(i + 2);
                    changed = true;
                    break;
                }
        }
        return s;
    }
}
