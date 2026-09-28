class Solution {
    public int countSubstrings(String s) {
        int count = 0;
        for (int i = 0; i < s.length(); i++)
            for (int j = i; j < s.length(); j++) {
                int l = i, r = j;
                while (l < r && s.charAt(l) == s.charAt(r)) { l++; r--; }
                if (l >= r) count++;                        // s[i..j] is a palindrome
            }
        return count;
    }
}
