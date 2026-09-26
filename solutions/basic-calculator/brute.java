class Solution {
    private int i;

    public int calculate(String s) {
        i = 0;
        return eval(s);
    }

    private int eval(String s) {                         // evaluates until ")" or the end
        int result = 0, sign = 1;
        while (i < s.length()) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) {
                int num = 0;
                while (i < s.length() && Character.isDigit(s.charAt(i))) num = num * 10 + (s.charAt(i++) - '0');
                result += sign * num;
                continue;
            }
            i++;
            if (c == '+') sign = 1;
            else if (c == '-') sign = -1;
            else if (c == '(') result += sign * eval(s);  // recurse into the bracket
            else if (c == ')') return result;
        }
        return result;
    }
}
