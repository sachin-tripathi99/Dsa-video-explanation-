class Solution {
    public List<String> fizzBuzz(int n) {
        List<String> answer = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            String s = "";
            if (i % 3 == 0) s += "Fizz";
            if (i % 5 == 0) s += "Buzz";
            answer.add(s.isEmpty() ? String.valueOf(i) : s);
        }
        return answer;
    }
}
