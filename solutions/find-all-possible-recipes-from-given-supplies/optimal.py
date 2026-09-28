from collections import defaultdict, deque

class Solution:
    def findAllRecipes(self, recipes: List[str], ingredients: List[List[str]], supplies: List[str]) -> List[str]:
        need = {r: len(ing) for r, ing in zip(recipes, ingredients)}
        users = defaultdict(list)               # ingredient → recipes using it
        for r, ing in zip(recipes, ingredients):
            for x in ing:
                users[x].append(r)
        q = deque(supplies)                     # start from what we have
        made = []
        while q:
            x = q.popleft()
            for r in users[x]:
                need[r] -= 1
                if need[r] == 0:
                    made.append(r)
                    q.append(r)
        return made
