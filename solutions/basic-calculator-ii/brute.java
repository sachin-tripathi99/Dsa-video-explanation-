class Solution {
    public int calculate(String s) {
        List<Object> tokens = new ArrayList<>();
        int num = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) num = num * 10 + (c - '0');
            else if ("+-*/".indexOf(c) >= 0) { tokens.add(num); tokens.add(c); num = 0; }
        }
        tokens.add(num);
        List<Object> terms = new ArrayList<>();                 // pass 1: fold × and ÷
        terms.add(tokens.get(0));
        for (int i = 1; i < tokens.size(); i += 2) {
            char op = (char) tokens.get(i);
            int n = (int) tokens.get(i + 1);
            int last = terms.size() - 1;
            if (op == '*') terms.set(last, (int) terms.get(last) * n);
            else if (op == '/') terms.set(last, (int) terms.get(last) / n);
            else { terms.add(op); terms.add(n); }
        }
        int total = (int) terms.get(0);                          // pass 2: + and −
        for (int i = 1; i < terms.size(); i += 2)
            total = (char) terms.get(i) == '+' ? total + (int) terms.get(i + 1) : total - (int) terms.get(i + 1);
        return total;
    }
}
