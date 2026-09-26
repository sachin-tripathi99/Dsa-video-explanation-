class Solution {
    public boolean isPalindrome(String s) {
        StringBuilder t = new StringBuilder();
        for (char c : s.toCharArray())
            if (Character.isLetterOrDigit(c)) t.append(Character.toLowerCase(c));
        String a = t.toString();
        return a.equals(t.reverse().toString());
    }
}
