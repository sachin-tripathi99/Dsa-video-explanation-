class Solution {
    public ListNode oddEvenList(ListNode head) {
        List<Integer> odd = new ArrayList<>(), even = new ArrayList<>();
        int pos = 1;
        for (ListNode c = head; c != null; c = c.next, pos++) (pos % 2 == 1 ? odd : even).add(c.val);
        odd.addAll(even);
        ListNode dummy = new ListNode(0), tail = dummy;
        for (int x : odd) { tail.next = new ListNode(x); tail = tail.next; }
        return dummy.next;
    }
}
