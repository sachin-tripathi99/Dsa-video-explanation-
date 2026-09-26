class Solution {
    public int calculate(String s) {
        int result = 0, last = 0, num = 0;
        char op = '+';
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) num = num * 10 + (c - '0');
            if ((!Character.isDigit(c) && c != ' ') || i == s.length() - 1) {
                if (op == '+' || op == '-') {                   // close the previous term
                    result += last;
                    last = op == '+' ? num : -num;
                } else if (op == '*') last = last * num;        // × ÷ change the open term
                else last = last / num;
                op = c;
                num = 0;
            }
        }
        return result + last;
    }
}
