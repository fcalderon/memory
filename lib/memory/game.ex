defmodule Memory.Game do
  def new do
    board = get_board()
    %{
      clicks: 0,
      board: board,
      skeleton: get_skeleton(board, [], nil, nil),
      guessed: [],
      guess1: nil,
      guess2: nil
    }
  end

  def client_view(game) do
    %{
      clicks: game.clicks,
      skeleton: get_skeleton(game.board, game.guessed, game.guess1, game.guess2),
      guess1: game.guess1,
      guess2: game.guess2
    }
  end

  def guess(game, guess) do
    if guess == nil do
      updated = Map.put(game, :guess1, nil)
      updated = Map.put(updated, :guess2, nil)

    else
      updated = Map.put(game, :clicks, game.clicks + 1)

      if updated.guess1 == nil do
        updated = Map.put(updated, :guess1, guess)
      else
        if updated.guess2 == nil do
          updated = Map.put(updated, :guess2, guess)
        end

        if updated.guess1 != nil and updated.guess2 != nil do
          guessedLetter1 = Enum.at(updated.board, updated.guess1)
          guessedLetter2 = Enum.at(updated.board, updated.guess2)
          if guessedLetter1 == guessedLetter2 do
            updated = Map.put(updated, :guessed, Enum.concat(updated.guessed, [guessedLetter1]))
          end
        end
      end
    end
    updated
  end

  def get_board() do
    letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
    Enum.shuffle(Enum.concat(letters, letters))
  end

  def get_skeleton(board, guessed, g1, g2) do
    skeleton = Enum.map(board, fn(x) -> get_symbol(x, guessed) end)
    set_guesses(board, skeleton, g1, g2)
  end

  defp get_symbol(letter, guesses) do
    if Enum.member?(guesses, letter) do
      "#"
    else
      "*"
    end
  end

  defp set_guesses(board, skeleton, guess1, guess2) do
    resultingList = skeleton

    if guess1 != nil do
      resultingList = List.update_at(resultingList, guess1, fn(x) -> Enum.at(board, guess1) end)
    end

    if guess2 != nil do
      resultingList = List.update_at(resultingList, guess2, fn(x) -> Enum.at(board , guess2) end)
    end

    resultingList
  end

end
